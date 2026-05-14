import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type DirectoryMember = Prisma.MemberGetPayload<{
  select: {
    id: true;
    name: true;
    membershipYear: true;
    handicap: true;
    zipcode: true;
  };
}>;

export default async function MembersPage() {
  await getMember(); // layout already ensures auth

  const members = (await prisma.member.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      membershipYear: true,
      handicap: true,
      zipcode: true,
    },
  })) as DirectoryMember[];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-fairway">Members</h1>
      <p className="mb-8 text-gray-600">
        NAGGA member directory. Only members can view this list.
      </p>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Region</th>
                <th className="px-4 py-3 font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 font-medium text-gray-700">Handicap</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">{m.name || "Member"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.zipcode ? `${m.zipcode.slice(0, 3)}xx` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.membershipYear}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.handicap != null ? m.handicap : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-500">No members yet.</p>
        )}
      </div>
    </div>
  );
}
