import { NextResponse } from "next/server";
import { getMember } from "@/lib/auth";

export async function GET() {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ member: null }, { status: 200 });
  }
  return NextResponse.json({
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      zipcode: member.zipcode,
      membershipYear: member.membershipYear,
      handicap: member.handicap,
      eventRegistrations: member.eventRegistrations.map(
        (r: { event: { id: string; title: string; date: Date } }) => ({
        eventId: r.event.id,
        eventTitle: r.event.title,
        eventDate: r.event.date,
      })),
    },
  });
}
