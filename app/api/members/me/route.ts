import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMember } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchBody = z.object({
  name: z.string().max(200).optional(),
  email: z.preprocess((v) => (v === "" ? null : v), z.string().email().max(200).nullable().optional()),
  zipcode: z.string().min(1).max(20).optional(),
  handicap: z.number().min(0).max(54).nullable().optional(),
  homePhone: z.string().max(30).optional(),
  mpId: z.string().max(50).optional(),
  status: z.string().max(50).optional(),
  initiatedDate: z.union([z.string(), z.null()]).optional(),
  slacksWaist: z.number().int().min(0).max(99).nullable().optional(),
  birthDate: z.union([z.string(), z.null()]).optional(),
  address: z.string().max(500).optional(),
  ghin: z.string().max(50).optional(),
  memberType: z.string().max(50).optional(),
  groupOfInitiation: z.string().max(100).optional(),
  slacksLength: z.number().int().min(0).max(99).nullable().optional(),
  sex: z.string().max(20).optional(),
  club: z.string().max(100).optional(),
  level: z.string().max(10).optional(),
  shirtSize: z.string().max(20).optional(),
  shoeSize: z.string().max(20).optional(),
});

function toMemberResp(m: {
  id: string; name: string | null; email: string | null; phone: string; zipcode: string;
  membershipYear: number; handicap: number | null; homePhone: string | null; mpId: string | null;
  status: string | null; initiatedDate: Date | null; slacksWaist: number | null; birthDate: Date | null;
  address: string | null; ghin: string | null; memberType: string | null; groupOfInitiation: string | null;
  slacksLength: number | null; sex: string | null; club: string | null; level: string | null;
  shirtSize: string | null; shoeSize: string | null;
}) {
  return {
    id: m.id, name: m.name, email: m.email, phone: m.phone, zipcode: m.zipcode,
    membershipYear: m.membershipYear, handicap: m.handicap, homePhone: m.homePhone, mpId: m.mpId,
    status: m.status, initiatedDate: m.initiatedDate?.toISOString() ?? null, slacksWaist: m.slacksWaist,
    birthDate: m.birthDate?.toISOString() ?? null, address: m.address, ghin: m.ghin, memberType: m.memberType,
    groupOfInitiation: m.groupOfInitiation, slacksLength: m.slacksLength, sex: m.sex, club: m.club,
    level: m.level, shirtSize: m.shirtSize, shoeSize: m.shoeSize,
  };
}

export async function GET() {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const m = await prisma.member.findUnique({
    where: { id: member.id },
  });
  if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member: toMemberResp(m) });
}

function parseDate(v: string | undefined): Date | null | undefined {
  if (v == null || v === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function PATCH(req: NextRequest) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await req.json();
    const data = patchBody.parse(raw);

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.email !== undefined) update.email = data.email;
    if (data.zipcode !== undefined) update.zipcode = data.zipcode;
    if (data.handicap !== undefined) update.handicap = data.handicap;
    if (data.homePhone !== undefined) update.homePhone = data.homePhone;
    if (data.mpId !== undefined) update.mpId = data.mpId;
    if (data.status !== undefined) update.status = data.status;
    if (data.initiatedDate !== undefined) {
      const v = data.initiatedDate;
      update.initiatedDate = (v === null || v === "") ? null : (parseDate(String(v)) ?? null);
    }
    if (data.slacksWaist !== undefined) update.slacksWaist = data.slacksWaist;
    if (data.birthDate !== undefined) {
      const v = data.birthDate;
      update.birthDate = v === null ? null : (parseDate(String(v)) ?? null);
    }
    if (data.address !== undefined) update.address = data.address;
    if (data.ghin !== undefined) update.ghin = data.ghin;
    if (data.memberType !== undefined) update.memberType = data.memberType;
    if (data.groupOfInitiation !== undefined) update.groupOfInitiation = data.groupOfInitiation;
    if (data.slacksLength !== undefined) update.slacksLength = data.slacksLength;
    if (data.sex !== undefined) update.sex = data.sex;
    if (data.club !== undefined) update.club = data.club;
    if (data.level !== undefined) update.level = data.level;
    if (data.shirtSize !== undefined) update.shirtSize = data.shirtSize;
    if (data.shoeSize !== undefined) update.shoeSize = data.shoeSize;

    const updated = await prisma.member.update({
      where: { id: member.id },
      data: update,
    });

    // When handicap changes, append to history
    if (data.handicap != null && data.handicap !== member.handicap) {
      await prisma.handicapHistory.create({
        data: { memberId: member.id, handicap: data.handicap },
      });
    }

    return NextResponse.json({ member: toMemberResp(updated) });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input.", details: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
