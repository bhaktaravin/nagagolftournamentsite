import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Quick check that the server can query Postgres (same path as real API routes). */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
