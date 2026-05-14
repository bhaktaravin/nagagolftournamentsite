import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIpFromRequest } from "@/lib/requestIp";

const body = z.object({
  phone: z.string().min(10).max(15),
  zipcode: z.string().min(5).max(10),
  name: z.string().max(200).optional(),
  email: z.preprocess((v) => (v === "" ? undefined : v), z.string().email().max(200).optional()),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIpFromRequest(req);
    const ipLimit = await checkRateLimit("join-ip", ip);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Too many join requests from this network. Try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } }
      );
    }

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
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Phone and zipcode are required." },
        { status: 400 }
      );
    }

    const prismaErr = e as { code?: string };
    if (typeof prismaErr.code === "string") {
      if (prismaErr.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "This phone number is already registered. Please log in instead.",
          },
          { status: 409 }
        );
      }
      if (prismaErr.code === "P2021" || prismaErr.code === "P2022") {
        return NextResponse.json(
          {
            error:
              "The database is missing tables or columns. Run `npx prisma db push` against the database URL used in production (Vercel → DATABASE_URL), then redeploy.",
          },
          { status: 503 }
        );
      }
    }

    const err = e as Error;
    if (err?.name === "PrismaClientInitializationError") {
      console.error("[join] database connection failed:", err.message);
      return NextResponse.json(
        {
          error:
            "The site could not reach the database. If you are the admin, confirm DATABASE_URL on the server and that the schema is deployed (e.g. prisma db push).",
        },
        { status: 503 }
      );
    }

    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
