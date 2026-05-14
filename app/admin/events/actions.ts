"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getClientIpFromHeaders } from "@/lib/requestIp";
import { requireAdmin } from "@/lib/requireAdmin";

function parseOptionalDeadline(dateStr: string | null, timeStr: string | null): Date | null {
  const d = dateStr?.trim();
  if (!d) return null;
  const t = timeStr?.trim() || "23:59";
  const combined = new Date(`${d}T${t}`);
  return Number.isNaN(combined.getTime()) ? null : combined;
}

function parseOptionalPositiveInt(raw: string | null): number | null {
  const t = raw?.trim();
  if (!t) return null;
  const n = Number.parseInt(t, 10);
  return Number.isNaN(n) || n < 1 ? null : n;
}

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

  const title = (formData.get("title") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = (formData.get("location") as string)?.trim() ?? "";
  const maxParticipants = parseOptionalPositiveInt(formData.get("maxParticipants") as string);
  const format = (formData.get("format") as string)?.trim() || null;
  const tournamentNotes = (formData.get("tournamentNotes") as string)?.trim() || null;
  const regDeadlineDate = formData.get("registrationDeadlineDate") as string | null;
  const regDeadlineTime = formData.get("registrationDeadlineTime") as string | null;
  const registrationDeadline = parseOptionalDeadline(regDeadlineDate, regDeadlineTime);

  const date = new Date(`${dateStr}T${timeStr}`);

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      location,
      maxParticipants,
      format,
      tournamentNotes,
      registrationDeadline,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      actorId: admin.id,
      action: "EVENT_CREATE",
      resourceType: "Event",
      resourceId: event.id,
      details: { title: event.title },
      ip,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function updateEvent(eventId: string, formData: FormData) {
  const admin = await requireAdmin();
  const ip = await getClientIpFromHeaders();

  const title = (formData.get("title") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const location = (formData.get("location") as string)?.trim() ?? "";
  const maxParticipants = parseOptionalPositiveInt(formData.get("maxParticipants") as string);
  const format = (formData.get("format") as string)?.trim() || null;
  const tournamentNotes = (formData.get("tournamentNotes") as string)?.trim() || null;
  const regDeadlineDate = formData.get("registrationDeadlineDate") as string | null;
  const regDeadlineTime = formData.get("registrationDeadlineTime") as string | null;
  const registrationDeadline = parseOptionalDeadline(regDeadlineDate, regDeadlineTime);
  const isPublished = formData.get("isPublished") === "on";

  const date = new Date(`${dateStr}T${timeStr}`);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      date,
      location,
      maxParticipants,
      format,
      tournamentNotes,
      registrationDeadline,
      isPublished,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      actorId: admin.id,
      action: "EVENT_UPDATE",
      resourceType: "Event",
      resourceId: eventId,
      details: { title },
      ip,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath("/dashboard/events");
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function createPairing(eventId: string, formData: FormData) {
  await requireAdmin();
  const label = (formData.get("label") as string)?.trim();
  if (!label) {
    return;
  }

  const last = await prisma.eventPairing.findFirst({
    where: { eventId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const sortOrder = (last?.sortOrder ?? -1) + 1;

  await prisma.eventPairing.create({
    data: { eventId, label, sortOrder },
  });

  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function deletePairing(pairingId: string, formData?: FormData) {
  void formData;
  await requireAdmin();

  const pairing = await prisma.eventPairing.findUnique({
    where: { id: pairingId },
    select: { eventId: true },
  });
  if (!pairing) return;

  await prisma.eventPairing.delete({ where: { id: pairingId } });

  revalidatePath(`/admin/events/${pairing.eventId}/edit`);
  revalidatePath(`/dashboard/events/${pairing.eventId}`);
}

export async function saveRegistrationAssignments(eventId: string, formData: FormData) {
  await requireAdmin();

  const regs = (await prisma.eventRegistration.findMany({
    where: { eventId },
    select: { id: true },
  })) as { id: string }[];

  if (regs.length > 0) {
    await prisma.$transaction(
      regs.map((r) => {
        const flight = (formData.get(`flight_${r.id}`) as string)?.trim() || null;
        const pairingRaw = (formData.get(`pairing_${r.id}`) as string)?.trim();
        const pairingId = pairingRaw && pairingRaw.length > 0 ? pairingRaw : null;
        return prisma.eventRegistration.update({
          where: { id: r.id },
          data: { flight, pairingId },
        });
      })
    );
  }

  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function saveEventScores(eventId: string, formData: FormData) {
  await requireAdmin();

  const regs = (await prisma.eventRegistration.findMany({
    where: { eventId },
    select: { memberId: true },
  })) as { memberId: string }[];

  const memberIds = [...new Set(regs.map((r) => r.memberId))];

  for (const memberId of memberIds) {
    const g = (formData.get(`gross_${memberId}`) as string)?.trim();
    const n = (formData.get(`net_${memberId}`) as string)?.trim();
    const pl = (formData.get(`place_${memberId}`) as string)?.trim();
    const notes = (formData.get(`scoreNotes_${memberId}`) as string)?.trim() || null;

    const gross = g === "" || g === undefined ? null : Number.parseInt(g, 10);
    const net = n === "" || n === undefined ? null : Number.parseFloat(n);
    const place = pl === "" || pl === undefined ? null : Number.parseInt(pl, 10);

    const hasAny =
      (gross !== null && !Number.isNaN(gross)) ||
      (net !== null && !Number.isNaN(net)) ||
      (place !== null && !Number.isNaN(place)) ||
      (notes && notes.length > 0);

    if (!hasAny) {
      await prisma.eventScore.deleteMany({ where: { eventId, memberId } });
      continue;
    }

    if (
      (gross !== null && Number.isNaN(gross)) ||
      (net !== null && Number.isNaN(net)) ||
      (place !== null && Number.isNaN(place))
    ) {
      continue;
    }

    await prisma.eventScore.upsert({
      where: {
        eventId_memberId: { eventId, memberId },
      },
      create: {
        eventId,
        memberId,
        gross: gross ?? null,
        net: net ?? null,
        place: place ?? null,
        notes,
      },
      update: {
        gross: gross ?? null,
        net: net ?? null,
        place: place ?? null,
        notes,
      },
    });
  }

  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath(`/dashboard/events/${eventId}`);
}
