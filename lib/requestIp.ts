import type { NextRequest } from "next/server";
import { headers } from "next/headers";

export function getClientIpFromRequest(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

/** Use from Server Actions / RSC where only `headers()` is available. */
export async function getClientIpFromHeaders(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.slice(0, 128);
  return null;
}
