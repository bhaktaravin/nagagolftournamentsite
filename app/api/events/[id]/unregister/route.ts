import { NextRequest, NextResponse } from "next/server";
import { RegistrationStatus } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const reg = await prisma.eventRegistration.findFirst({
    where: { eventId, memberId: session.memberId },
  });

  if (!reg) {
    return NextResponse.json({ error: "Not registered for this event." }, { status: 404 });
  }

  const wasMain = reg.status === RegistrationStatus.REGISTERED;

  await prisma.$transaction(async (tx) => {
    await tx.eventRegistration.delete({
      where: { id: reg.id },
    });

    if (!wasMain) {
      return;
    }

    const event = await tx.event.findUnique({
      where: { id: eventId },
      select: { maxParticipants: true },
    });

    if (event?.maxParticipants == null) {
      return;
    }

    const nextWait = await tx.eventRegistration.findFirst({
      where: { eventId, status: RegistrationStatus.WAITLISTED },
      orderBy: { createdAt: "asc" },
    });

    if (nextWait) {
      await tx.eventRegistration.update({
        where: { id: nextWait.id },
        data: { status: RegistrationStatus.REGISTERED },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
