import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      maxParticipants: e.maxParticipants,
      registeredCount: e._count.registrations,
    })),
  });
}
