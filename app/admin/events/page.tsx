import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { deleteEvent } from "./actions";

type AdminEventRow = Prisma.EventGetPayload<{
    include: { _count: { select: { registrations: true } } };
}>;

export default async function AdminEventsPage() {
    const events = (await prisma.event.findMany({
        orderBy: { date: "desc" },
        include: { _count: { select: { registrations: true } } },
    })) as AdminEventRow[];

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                <Link href="/admin/events/new" className="btn-primary">
                    + New Event
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Reg
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {event.title}
                                    </div>
                                    {event.description && (
                                        <div className="text-xs text-gray-500 max-w-xs truncate">
                                            {event.description}
                                        </div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {event.date.toLocaleDateString()}{" "}
                                    {event.date.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {event.location}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {event._count.registrations}
                                    {event.maxParticipants ? ` / ${event.maxParticipants}` : ""}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/events/${event.id}/edit`}
                                        className="mr-4 text-[#1a472a] hover:text-[#2d5a3d]"
                                    >
                                        Edit
                                    </Link>
                                    <form className="inline" action={deleteEvent.bind(null, event.id)}>
                                        <button
                                            type="submit"
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No events found. Create one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
