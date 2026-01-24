import Link from "next/link";
import { CreateEventForm } from "./CreateEventForm";

export default function NewEventPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
                <Link href="/admin/events" className="text-sm text-gray-600 hover:text-gray-900">
                    Cancel
                </Link>
            </div>
            <CreateEventForm />
        </div>
    );
}
