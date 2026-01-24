import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function LeaderboardPage() {
  await getMember();

  const members = await prisma.member.findMany({
    where: { handicap: { not: null } },
    orderBy: { handicap: "asc" },
    select: {
      id: true,
      name: true,
      handicap: true,
      membershipYear: true,
    },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">Leaderboard</h1>
      <p className="mb-8 text-gray-600">
        Members by handicap (lowest first). Only members with a handicap on file are shown.
      </p>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-700">#</th>
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Handicap</th>
                <th className="px-4 py-3 font-medium text-gray-700">Year</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{m.name || "Member"}</td>
                  <td className="px-4 py-3">{m.handicap}</td>
                  <td className="px-4 py-3 text-gray-600">{m.membershipYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-500">
            No handicaps on file yet. Update your profile to appear here.
          </p>
        )}
      </div>
    </div>
  );
}
