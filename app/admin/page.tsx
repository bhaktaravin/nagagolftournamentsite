import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
    const memberCount = await prisma.member.count();
    const eventCount = await prisma.event.count();
    const registrationCount = await prisma.eventRegistration.count();

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="card border-l-4 border-l-fairway">
                    <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{memberCount}</p>
                </div>
                <div className="card border-l-4 border-l-fairway">
                    <h3 className="text-sm font-medium text-gray-500">Events</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{eventCount}</p>
                </div>
                <div className="card border-l-4 border-l-fairway">
                    <h3 className="text-sm font-medium text-gray-500">Total Registrations</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{registrationCount}</p>
                </div>
            </div>
        </div>
    );
}
