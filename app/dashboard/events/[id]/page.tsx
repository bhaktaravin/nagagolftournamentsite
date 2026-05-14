import Link from "next/link";
import { notFound } from "next/navigation";
import { RegistrationStatus } from "@prisma/client";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/formatDate";
import { EventActions } from "@/components/EventActions";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const member = await getMember();
  if (!member) return null;

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id, isPublished: true },
    include: {
      registrations: {
        where: { memberId: member.id },
        select: {
          id: true,
          status: true,
          flight: true,
          pairing: { select: { label: true } },
        },
      },
      scores: {
        include: {
          member: { select: { name: true } },
        },
      },
    },
  });

  if (!event) notFound();

  const [registeredCount, waitlistCount] = await Promise.all([
    prisma.eventRegistration.count({
      where: { eventId: id, status: RegistrationStatus.REGISTERED },
    }),
    prisma.eventRegistration.count({
      where: { eventId: id, status: RegistrationStatus.WAITLISTED },
    }),
  ]);

  const registration = event.registrations[0];
  const isRegistered = !!registration;
  const isWaitlisted = registration?.status === RegistrationStatus.WAITLISTED;

  const isFull =
    event.maxParticipants != null && registeredCount >= event.maxParticipants;

  const registrationClosed = !!(
    event.registrationDeadline && new Date() > event.registrationDeadline
  );

  const scoresSorted = [...event.scores].sort((a, b) => {
    if (a.place != null && b.place != null && a.place !== b.place) {
      return a.place - b.place;
    }
    if (a.place != null && b.place == null) return -1;
    if (a.place == null && b.place != null) return 1;
    const an = a.net ?? 999;
    const bn = b.net ?? 999;
    return an - bn;
  });

  const hasResults = scoresSorted.some(
    (s) => s.gross != null || s.net != null || s.place != null || (s.notes && s.notes.length > 0)
  );

  return (
    <div>
      <Link
        href="/dashboard/events"
        className="mb-4 inline-block text-sm text-gray-600 hover:text-fairway"
      >
        ← Back to events
      </Link>

      <div className="card max-w-2xl">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-semibold text-fairway">{event.title}</h1>
          {event.format ? (
            <span className="rounded-full bg-fairway/10 px-3 py-1 text-xs font-semibold text-fairway">
              {event.format}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-gray-500">{formatDateTime(event.date)}</p>
        <p className="mt-2 font-medium text-gray-700">{event.location}</p>

        {event.description && (
          <p className="mt-4 text-gray-600">{event.description}</p>
        )}

        {event.tournamentNotes ? (
          <div className="mt-4 rounded-lg border border-tee bg-tee/40 px-4 py-3 text-sm text-gray-800">
            <p className="font-semibold text-fairway">Tournament details</p>
            <p className="mt-2 whitespace-pre-wrap">{event.tournamentNotes}</p>
          </div>
        ) : null}

        {event.registrationDeadline ? (
          <p className="mt-3 text-sm text-gray-600">
            Registration closes:{" "}
            <span className="font-medium text-gray-800">
              {formatDateTime(event.registrationDeadline)}
            </span>
          </p>
        ) : null}

        <p className="mt-4 text-sm text-gray-500">
          {registeredCount}
          {event.maxParticipants != null ? ` / ${event.maxParticipants}` : ""} registered
          {waitlistCount > 0 ? ` · ${waitlistCount} on waitlist` : ""}
        </p>

        <a
          href={`/api/events/${event.id}/calendar`}
          className="mt-3 inline-block text-sm font-medium text-fairway hover:underline"
        >
          Add to calendar (.ics)
        </a>

        {isRegistered || isWaitlisted ? (
          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {registration?.flight ? (
              <p>
                <span className="font-medium text-gray-900">Flight:</span> {registration.flight}
              </p>
            ) : null}
            {registration?.pairing?.label ? (
              <p className={registration?.flight ? "mt-1" : ""}>
                <span className="font-medium text-gray-900">Pairing:</span>{" "}
                {registration.pairing.label}
              </p>
            ) : null}
            {!registration?.flight && !registration?.pairing?.label ? (
              <p className="text-gray-500">Pairing and flight will appear here when set by admin.</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6">
          <EventActions
            eventId={event.id}
            isRegistered={isRegistered}
            isWaitlisted={isWaitlisted}
            isFull={isFull}
            registrationClosed={registrationClosed}
          />
        </div>
      </div>

      {hasResults ? (
        <div className="card mt-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-fairway">Results</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="py-2 pr-4">Place</th>
                  <th className="py-2 pr-4">Player</th>
                  <th className="py-2 pr-4">Gross</th>
                  <th className="py-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {scoresSorted.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-800">{s.place ?? "—"}</td>
                    <td className="py-2 pr-4 font-medium text-gray-900">
                      {s.member.name || "Member"}
                    </td>
                    <td className="py-2 pr-4">{s.gross ?? "—"}</td>
                    <td className="py-2">{s.net ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
