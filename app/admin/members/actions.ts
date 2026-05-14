"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { getClientIpFromHeaders } from "@/lib/requestIp";
import { requireAdmin } from "@/lib/requireAdmin";

export async function updateMember(memberId: string, formData: FormData) {
  const admin = await requireAdmin();
  const ip = await getClientIpFromHeaders();

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const zipcode = formData.get("zipcode") as string;
  const role = formData.get("role") as string;
  const handicapStr = formData.get("handicap") as string;

  const handicap = handicapStr ? Number.parseFloat(handicapStr) : null;

  const currentMember = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!currentMember) {
    throw new Error("Member not found");
  }

  if (currentMember.handicap !== handicap && handicap !== null) {
    await prisma.handicapHistory.create({
      data: {
        memberId,
        handicap,
      },
    });
  }

  await prisma.member.update({
    where: { id: memberId },
    data: {
      name,
      phone,
      email,
      zipcode,
      role: role as Role,
      handicap,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      actorId: admin.id,
      action: "MEMBER_UPDATE",
      resourceType: "Member",
      resourceId: memberId,
      details: { role },
      ip,
    },
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}/edit`);
  revalidatePath("/dashboard/leaderboard");

  return { success: true };
}
