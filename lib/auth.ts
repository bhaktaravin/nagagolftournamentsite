import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nagga-dev-secret-change-in-production"
);

export type SessionPayload = { memberId: string; phone: string; exp: number };

export async function createSession(memberId: string, phone: string): Promise<string> {
  const token = await new SignJWT({ memberId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get("nagga_session")?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getMember() {
  const s = await getSession();
  if (!s) return null;
  return prisma.member.findUnique({
    where: { id: s.memberId },
    include: { eventRegistrations: { include: { event: true } } },
  });
}

export async function setSessionCookie(token: string) {
  const c = await cookies();
  c.set("nagga_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete("nagga_session");
}
