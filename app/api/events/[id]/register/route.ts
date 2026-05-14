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

  // 1. Get event and count only REGISTERED participants
  const event = await prisma.event.findUnique({
    where: { id: eventId, isPublished: true },
    include: {
      _count: {
        select: {
          registrations: {
            where: { status: RegistrationStatus.REGISTERED },
          },
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return NextResponse.json(
      { error: "Registration for this event is closed." },
      { status: 400 }
    );
  }

  // 2. Determine status based on capacity
  let status: RegistrationStatus = RegistrationStatus.REGISTERED;
  if (event.maxParticipants != null && event._count.registrations >= event.maxParticipants) {
    status = RegistrationStatus.WAITLISTED;
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_memberId: { eventId, memberId: session.memberId },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You are already registered/waitlisted for this event." },
      { status: 400 }
    );
  }

  await prisma.eventRegistration.create({
    data: {
      eventId,
      memberId: session.memberId,
      status,
    },
  });

  return NextResponse.json({ ok: true });
}
