"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteEvent(id: string) {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/events");
}

export async function createEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const location = formData.get("location") as string;
    const maxParticipants = formData.get("maxParticipants") as string;

    // Combine date and time
    const date = new Date(`${dateStr}T${timeStr}`);

    await prisma.event.create({
        data: {
            title,
            description,
            date,
            location,
            maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        },
    });

    revalidatePath("/admin/events");
    return { success: true };
}
