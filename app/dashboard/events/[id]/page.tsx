import Link from "next/link";
import { notFound } from "next/navigation";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
      _count: { select: { registrations: true } },
      registrations: {
        where: { memberId: member.id },
        select: { id: true },
      },
    },
  });

  if (!event) notFound();

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const isRegistered = event.registrations.length > 0;
  const isFull =
    event.maxParticipants != null &&
    event._count.registrations >= event.maxParticipants;

  return (
    <div>
      <Link
        href="/dashboard/events"
        className="mb-4 inline-block text-sm text-gray-600 hover:text-fairway"
      >
        ← Back to events
      </Link>

      <div className="card max-w-2xl">
        <h1 className="text-2xl font-semibold text-fairway">{event.title}</h1>
        <p className="mt-1 text-gray-500">{formatDate(event.date)}</p>
        <p className="mt-2 font-medium text-gray-700">{event.location}</p>

        {event.description && (
          <p className="mt-4 text-gray-600">{event.description}</p>
        )}

        <p className="mt-4 text-sm text-gray-500">
          {event._count.registrations}
          {event.maxParticipants != null ? ` / ${event.maxParticipants}` : ""}{" "}
          registered
        </p>

        <div className="mt-6">
          <EventActions
            eventId={event.id}
            isRegistered={isRegistered}
            isFull={isFull}
          />
        </div>
      </div>
    </div>
  );
}
