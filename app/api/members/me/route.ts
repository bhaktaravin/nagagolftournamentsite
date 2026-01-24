import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";

const body = z.object({
  name: z.string().max(200).optional(),
  email: z.preprocess((v) => (v === "" ? null : v), z.string().email().max(200).nullable().optional()),
  zipcode: z.string().min(5).max(10).optional(),
  handicap: z.number().min(0).max(54).nullable().optional(),
});

export async function GET() {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    member: {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      zipcode: member.zipcode,
      membershipYear: member.membershipYear,
      handicap: member.handicap,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await req.json();
    const data = body.parse(raw);

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.zipcode !== undefined && { zipcode: data.zipcode }),
        ...(data.handicap !== undefined && { handicap: data.handicap }),
      },
    });

    return NextResponse.json({
      member: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        zipcode: updated.zipcode,
        handicap: updated.handicap,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
