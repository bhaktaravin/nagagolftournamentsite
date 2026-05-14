import Link from "next/link";
import { RegistrationStatus } from "@prisma/client";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/formatDate";

export default async function EventsPage() {
  await getMember();

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
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

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">Events</h1>
      <p className="mb-8 text-gray-600">
        NAGGA tournaments, scrambles, and outings. Register for upcoming events.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <div key={e.id} className="card flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-fairway">
                <Link href={`/dashboard/events/${e.id}`} className="hover:underline">
                  {e.title}
                </Link>
              </h2>
              {e.format ? (
                <span className="shrink-0 rounded-full bg-fairway/10 px-2 py-0.5 text-xs font-medium text-fairway">
                  {e.format}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-gray-500">{formatDateTime(e.date)}</p>
            <p className="mt-2 text-sm text-gray-600">{e.location}</p>
            {e.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {e.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {e._count.registrations}
              {e.maxParticipants != null ? ` / ${e.maxParticipants}` : ""} registered
            </p>
            <Link
              href={`/dashboard/events/${e.id}`}
              className="btn-primary mt-4 w-fit text-sm"
            >
              View & Register
            </Link>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="card text-center text-gray-500">
          No events scheduled. Check back later.
        </div>
      )}
    </div>
  );
}
