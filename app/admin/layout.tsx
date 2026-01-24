import { getMember } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const member = await getMember();

    // @ts-ignore - Role will be available after schema push
    if (!member || member.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#1a472a] text-white">
                <div className="flex h-16 items-center px-6 border-b border-white/10">
                    <span className="text-xl font-bold">NAGGA Admin</span>
                </div>
                <nav className="mt-6 space-y-1 px-3">
                    <Link
                        href="/admin"
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/events"
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
                    >
                        Events
                    </Link>
                    <Link
                        href="/admin/members"
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
                    >
                        Members
                    </Link>
                </nav>
                <div className="absolute bottom-4 left-0 w-full px-3">
                    <Link
                        href="/dashboard"
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
                    >
                        Preview Site
                    </Link>
                </div>
            </aside>
            <main className="pl-64">
                <div className="px-8 py-8">{children}</div>
            </main>
        </div>
    );
}
