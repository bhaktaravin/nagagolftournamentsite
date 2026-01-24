import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditMemberForm } from "./EditMemberForm";

export default async function EditMemberPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const member = await prisma.member.findUnique({
        where: { id },
    });

    if (!member) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Edit Member</h1>
                <Link href="/admin/members" className="text-sm text-gray-600 hover:text-gray-900">
                    Cancel
                </Link>
            </div>
            {/* @ts-ignore */}
            <EditMemberForm member={member} />
        </div>
    );
}
