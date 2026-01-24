import Link from "next/link";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/formatDate";

export default async function HandicapHistoryPage() {
  const member = await getMember();
  if (!member) return null;

  const history = await prisma.handicapHistory.findMany({
    where: { memberId: member.id },
    orderBy: { recordedAt: "desc" },
  });

  return (
    <div>
      <Link href="/dashboard/profile" className="mb-4 inline-block text-sm text-gray-600 hover:text-fairway">
        ← Back to My Profile
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-fairway">Handicap History</h1>

      <div className="card max-w-2xl">
        {history.length === 0 ? (
          <p className="text-gray-500">No handicap history yet. Update your handicap in your profile to record it here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 font-medium text-gray-700">Handicap</th>
                  <th className="pb-2 font-medium text-gray-700">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-gray-100">
                    <td className="py-2">{h.handicap.toFixed(2)}</td>
                    <td className="py-2 text-gray-600" suppressHydrationWarning>
                      {formatDateTime(h.recordedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
