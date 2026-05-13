import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/formatDate";

export default async function AdminAuditPage() {
  const rows = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 150,
    include: {
      actor: { select: { name: true, phone: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Audit log</h1>
      <p className="mb-6 text-gray-600">
        Recent admin actions (member updates, event create/delete). IPs are captured when the
        request forwarded them.
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">When</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Resource</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatDate(r.createdAt)}{" "}
                    {r.createdAt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.action}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.resourceType}
                    {r.resourceId ? (
                      <span className="ml-1 font-mono text-xs text-gray-500">{r.resourceId}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.actor.name || "—"}
                    <span className="ml-2 text-xs text-gray-500">{r.actor.phone}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.ip || "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No audit entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
