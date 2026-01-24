"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateMember(memberId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const zipcode = formData.get("zipcode") as string;
    const role = formData.get("role") as string;
    const handicapStr = formData.get("handicap") as string;

    const handicap = handicapStr ? parseFloat(handicapStr) : null;

    // 1. Get current member to check for handicap change
    const currentMember = await prisma.member.findUnique({
        where: { id: memberId },
    });

    if (!currentMember) {
        throw new Error("Member not found");
    }

    // 2. If handicap changed, record history
    if (currentMember.handicap !== handicap && handicap !== null) {
        await prisma.handicapHistory.create({
            data: {
                memberId,
                handicap,
                // recordedAt is default now()
            },
        });
    }

    // 3. Update member
    // @ts-ignore - Role enum compatibility
    await prisma.member.update({
        where: { id: memberId },
        data: {
            name,
            phone,
            email,
            zipcode,
            role: role as any,
            handicap,
        },
    });

    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${memberId}/edit`);
    revalidatePath("/dashboard/leaderboard");

    return { success: true };
}
