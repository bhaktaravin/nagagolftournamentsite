import Link from "next/link";
import type { Event, Prisma } from "@prisma/client";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/formatDate";

type RegistrationWithEvent = Prisma.EventRegistrationGetPayload<{
  include: { event: true };
}>;

export default async function DashboardPage() {
  const member = await getMember();
  if (!member) return null;

  const [upcoming, myRegistrations] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: new Date() }, isPublished: true },
      orderBy: { date: "asc" },
      take: 5,
    }) as Promise<Event[]>,
    prisma.eventRegistration.findMany({
      where: { memberId: member.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }) as Promise<RegistrationWithEvent[]>,
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">
        Dashboard
      </h1>
      <p className="mb-8 text-gray-600">
        Welcome, {member.name || "Member"}. Here’s your NAGGA overview.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Your Event Registrations
          </h2>
          {myRegistrations.length === 0 ? (
            <p className="text-gray-500">You haven’t registered for any events yet.</p>
          ) : (
            <ul className="space-y-3">
              {myRegistrations.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <Link href={`/dashboard/events/${r.event.id}`} className="font-medium text-fairway hover:underline">
                      {r.event.title}
                    </Link>
                    <p className="text-gray-500">{formatDate(r.event.date)}</p>
                  </div>
                  <Link href={`/dashboard/events/${r.event.id}`} className="btn-secondary text-xs">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/dashboard/events" className="mt-4 inline-block text-sm font-medium text-fairway hover:underline">
            Browse all events →
          </Link>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Upcoming Events
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming events at the moment.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <div>
                    <Link href={`/dashboard/events/${e.id}`} className="font-medium text-fairway hover:underline">
                      {e.title}
                    </Link>
                    <p className="text-gray-500">
                      {formatDate(e.date)} · {e.location}
                    </p>
                  </div>
                  <Link href={`/dashboard/events/${e.id}`} className="btn-primary text-xs">
                    Register
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/dashboard/events" className="mt-4 inline-block text-sm font-medium text-fairway hover:underline">
            View all events →
          </Link>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Member Info</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <dt className="text-gray-500">Membership year</dt>
          <dd className="font-medium">{member.membershipYear}</dd>
          <dt className="text-gray-500">Handicap</dt>
          <dd className="font-medium">{member.handicap ?? "—"}</dd>
        </dl>
        <Link href="/dashboard/profile" className="mt-4 inline-block text-sm font-medium text-fairway hover:underline">
          My Profile →
        </Link>
      </div>
    </div>
  );
}
