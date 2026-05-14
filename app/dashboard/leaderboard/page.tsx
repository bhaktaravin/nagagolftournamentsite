import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type LeaderboardMember = Prisma.MemberGetPayload<{
  select: {
    id: true;
    name: true;
    handicap: true;
    membershipYear: true;
    handicapHistory: {
      take: 1;
      orderBy: { recordedAt: "desc" };
      select: { handicap: true };
    };
  };
}>;

export default async function LeaderboardPage() {
  await getMember();

  const members = (await prisma.member.findMany({
    where: { handicap: { not: null } },
    orderBy: { handicap: "asc" },
    select: {
      id: true,
      name: true,
      handicap: true,
      membershipYear: true,
      handicapHistory: {
        take: 1,
        orderBy: { recordedAt: "desc" },
        select: { handicap: true },
      },
    },
  })) as LeaderboardMember[];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">Leaderboard</h1>
      <p className="mb-8 text-gray-600">
        Members by handicap. Arrows indicate change from last update.
      </p>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-700">#</th>
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Handicap</th>
                <th className="px-4 py-3 font-medium text-gray-700">Trend</th>
                <th className="px-4 py-3 font-medium text-gray-700">Year</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const prevHandicap = m.handicapHistory[0]?.handicap;
                const trend =
                  prevHandicap != null && m.handicap != null
                    ? m.handicap - prevHandicap
                    : 0;

                return (
                  <tr key={m.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{m.name || "Member"}</td>
                    <td className="px-4 py-3">{m.handicap}</td>
                    <td className="px-4 py-3">
                      {trend > 0 && (
                        <span className="flex items-center text-red-600">
                          ↑ <span className="ml-1 text-xs">+{trend.toFixed(1)}</span>
                        </span>
                      )}
                      {trend < 0 && (
                        <span className="flex items-center text-green-600">
                          ↓ <span className="ml-1 text-xs">{trend.toFixed(1)}</span>
                        </span>
                      )}
                      {trend === 0 && (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.membershipYear}</td>
                  </tr>
                );
              })}
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
