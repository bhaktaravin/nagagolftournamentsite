import { NextRequest, NextResponse } from "next/server";
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

  const event = await prisma.event.findUnique({
    where: { id: eventId, isPublished: true },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.maxParticipants != null && event._count.registrations >= event.maxParticipants) {
    return NextResponse.json(
      { error: "This event is full." },
      { status: 400 }
    );
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_memberId: { eventId, memberId: session.memberId },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You are already registered for this event." },
      { status: 400 }
    );
  }

  await prisma.eventRegistration.create({
    data: { eventId, memberId: session.memberId },
  });

  return NextResponse.json({ ok: true });
}
