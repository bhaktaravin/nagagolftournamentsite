import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      membershipYear: true,
      handicap: true,
      zipcode: true,
    },
  });

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.id,
      name: m.name || "Member",
      membershipYear: m.membershipYear,
      handicap: m.handicap,
      region: m.zipcode ? `${m.zipcode.slice(0, 3)}xx` : null,
    })),
  });
}
