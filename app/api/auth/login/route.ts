import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

const body = z.object({
  phone: z.string().min(10).max(15),
  zipcode: z.string().min(5).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const { phone, zipcode } = body.parse(raw);

    let normalizedPhone = phone.replace(/\D/g, "");
    if (normalizedPhone.length === 11 && normalizedPhone.startsWith("1")) {
      normalizedPhone = normalizedPhone.slice(1);
    }
    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: {
        phone: normalizedPhone,
        zipcode: zipcode.trim(),
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No member found with this phone and zipcode. Please join NAGGA first." },
        { status: 401 }
      );
    }

    const token = await createSession(member.id, member.phone);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      member: {
        id: member.id,
        name: member.name,
        phone: member.phone,
        membershipYear: member.membershipYear,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Phone and zipcode are required." },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
