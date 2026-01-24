import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const body = z.object({
  phone: z.string().min(10).max(15),
  zipcode: z.string().min(5).max(10),
  name: z.string().max(200).optional(),
  email: z.preprocess((v) => (v === "" ? undefined : v), z.string().email().max(200).optional()),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const { phone, zipcode, name, email } = body.parse(raw);

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

    const existing = await prisma.member.findFirst({
      where: { phone: normalizedPhone },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A member with this phone number already exists. Please log in." },
        { status: 409 }
      );
    }

    const member = await prisma.member.create({
      data: {
        phone: normalizedPhone,
        zipcode: zipcode.trim(),
        name: name || null,
        email: email && email.length ? email : null,
        status: "Joined",
        initiatedDate: new Date(),
        club: "NAGGA",
      },
    });

    return NextResponse.json({
      ok: true,
      member: { id: member.id, phone: member.phone },
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
