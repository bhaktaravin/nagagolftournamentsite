"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getClientIpFromHeaders } from "@/lib/requestIp";
import { requireAdmin } from "@/lib/requireAdmin";

export async function deleteEvent(id: string, formData?: FormData) {
  void formData;
  const admin = await requireAdmin();
  const ip = await getClientIpFromHeaders();

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return;
  }

  await prisma.$transaction([
    prisma.event.delete({ where: { id } }),
    prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "EVENT_DELETE",
        resourceType: "Event",
        resourceId: id,
        details: { title: existing.title },
        ip,
      },
    }),
  ]);

  revalidatePath("/admin/events");
}

export async function createEvent(formData: FormData) {
  const admin = await requireAdmin();
  const ip = await getClientIpFromHeaders();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = formData.get("location") as string;
  const maxParticipants = formData.get("maxParticipants") as string;

  const date = new Date(`${dateStr}T${timeStr}`);

  await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        title,
        description,
        date,
        location,
        maxParticipants: maxParticipants ? Number.parseInt(maxParticipants, 10) : null,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "EVENT_CREATE",
        resourceType: "Event",
        resourceId: event.id,
        details: { title: event.title },
        ip,
      },
    });
  });

  revalidatePath("/admin/events");
  return { success: true };
}
