import { prisma } from "@/lib/db";

export default async function AdminMembersPage() {
    // @ts-ignore - 'role' is not in client types yet
    const members = await prisma.member.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Members</h1>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Joined
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {member.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">{member.email}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {member.phone}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            // @ts-ignore
                                            member.role === "ADMIN"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {
                                            // @ts-ignore
                                            member.role
                                        }
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
