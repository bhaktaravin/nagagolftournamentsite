import { getMember } from "@/lib/auth";
import type { Member } from "@prisma/client";
import { Role } from "@prisma/client";

export class AdminAuthError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export async function requireAdmin(): Promise<Member> {
  const member = await getMember();
  if (!member || member.role !== Role.ADMIN) {
    throw new AdminAuthError();
  }
  return member;
}
