import Link from "next/link";
import { notFound } from "next/navigation";
import type { EventScore, EventPairing, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { toDateInputValue, toTimeInputValue } from "@/lib/datetimeForm";
import {
  createPairing,
  deletePairing,
  saveEventScores,
  saveRegistrationAssignments,
  updateEvent,
} from "../../actions";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type EventEditData = Prisma.EventGetPayload<{
  include: {
    pairings: true;
    registrations: {
      include: { member: { select: { name: true; phone: true } } };
    };
  };
}>;

type RegistrationRow = EventEditData["registrations"][number];

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await prisma.event.findUnique({
    where: { id },
    include: {
      pairings: { orderBy: { sortOrder: "asc" } },
      registrations: {
        orderBy: { createdAt: "asc" },
        include: { member: { select: { name: true, phone: true } } },
      },
    },
  });

  if (!raw) notFound();

  const event = raw as EventEditData;

  const scoresByMember = new Map<string, EventScore>(
    (
      await prisma.eventScore.findMany({
        where: { eventId: id },
      })
    ).map((s: EventScore) => [s.memberId, s])
  );

  const regDeadlineDate = event.registrationDeadline
    ? toDateInputValue(event.registrationDeadline)
    : "";
  const regDeadlineTime = event.registrationDeadline
    ? toTimeInputValue(event.registrationDeadline)
    : "";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/events" className="text-sm text-gray-600 hover:text-fairway">
            ← Events
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit event</h1>
          <p className="text-sm text-gray-500">{event.title}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Basics & tournament</h2>
          <form action={updateEvent.bind(null, event.id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={event.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={event.description ?? ""}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={toDateInputValue(event.date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                  defaultValue={toTimeInputValue(event.date)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required defaultValue={event.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Capacity (optional)</Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                defaultValue={event.maxParticipants ?? ""}
                placeholder="e.g. 72"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format (optional)</Label>
              <Input
                id="format"
                name="format"
                placeholder="e.g. Stroke play, Scramble, Stableford"
                defaultValue={event.format ?? ""}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="registrationDeadlineDate">Registration deadline — date (optional)</Label>
                <Input
                  id="registrationDeadlineDate"
                  name="registrationDeadlineDate"
                  type="date"
                  defaultValue={regDeadlineDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDeadlineTime">Registration deadline — time (optional)</Label>
                <Input
                  id="registrationDeadlineTime"
                  name="registrationDeadlineTime"
                  type="time"
                  defaultValue={regDeadlineTime}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tournamentNotes">Tournament notes (rules, prizes, tee policy)</Label>
              <Textarea
                id="tournamentNotes"
                name="tournamentNotes"
                rows={4}
                defaultValue={event.tournamentNotes ?? ""}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={event.isPublished}
                className="rounded border-gray-300"
              />
              Published (visible on member site)
            </label>
            <Button type="submit">Save event</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Pairings / tee groups</h2>
          <p className="text-sm text-gray-600">
            Add groups (e.g. “Shotgun — Hole 1” or “8:12 AM — Tee 10”). Assign players below.
          </p>
          <ul className="space-y-2">
            {event.pairings.map((p: EventPairing) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <span>{p.label}</span>
                <form action={deletePairing.bind(null, p.id)}>
                  <button type="submit" className="text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </li>
            ))}
            {event.pairings.length === 0 && (
              <li className="text-sm text-gray-500">No pairings yet.</li>
            )}
          </ul>
          <form action={createPairing.bind(null, event.id)} className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1 space-y-1">
              <Label htmlFor="pairingLabel">New pairing label</Label>
              <Input id="pairingLabel" name="label" placeholder="e.g. 8:00 AM — Group A" required />
            </div>
            <Button type="submit">Add pairing</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Player assignments</h2>
          <form action={saveRegistrationAssignments.bind(null, event.id)} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 pr-4">Player</th>
                    <th className="py-2 pr-4">Flight</th>
                    <th className="py-2">Pairing</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registrations.map((r: RegistrationRow) => (
                    <tr key={r.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-900">{r.member.name || "Member"}</div>
                        <div className="text-xs text-gray-500">{r.member.phone}</div>
                      </td>
                      <td className="py-2 pr-4">
                        <Input
                          name={`flight_${r.id}`}
                          defaultValue={r.flight ?? ""}
                          placeholder="A, B, C…"
                          className="max-w-[100px]"
                        />
                      </td>
                      <td className="py-2">
                        <select
                          name={`pairing_${r.id}`}
                          className="flex h-10 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 text-sm"
                          defaultValue={r.pairingId ?? ""}
                        >
                          <option value="">— None —</option>
                          {event.pairings.map((p: EventPairing) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {event.registrations.length === 0 ? (
              <p className="text-sm text-gray-500">No registrations yet.</p>
            ) : (
              <Button type="submit">Save assignments</Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Results (optional)</h2>
          <p className="text-sm text-gray-600">Gross / net / place appear on the member event page.</p>
          <form action={saveEventScores.bind(null, event.id)} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="py-2 pr-4">Player</th>
                    <th className="py-2 pr-2">Gross</th>
                    <th className="py-2 pr-2">Net</th>
                    <th className="py-2 pr-2">Place</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {event.registrations.map((r: RegistrationRow) => {
                    const sc = scoresByMember.get(r.memberId);
                    return (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-gray-900">
                          {r.member.name || "Member"}
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            name={`gross_${r.memberId}`}
                            type="number"
                            className="w-20"
                            defaultValue={sc?.gross ?? ""}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            name={`net_${r.memberId}`}
                            type="number"
                            step="0.1"
                            className="w-20"
                            defaultValue={sc?.net ?? ""}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            name={`place_${r.memberId}`}
                            type="number"
                            className="w-16"
                            defaultValue={sc?.place ?? ""}
                          />
                        </td>
                        <td className="py-2">
                          <Input
                            name={`scoreNotes_${r.memberId}`}
                            defaultValue={sc?.notes ?? ""}
                            placeholder="Optional"
                            className="min-w-[120px]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {event.registrations.length === 0 ? (
              <p className="text-sm text-gray-500">No players to score.</p>
            ) : (
              <Button type="submit">Save results</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
