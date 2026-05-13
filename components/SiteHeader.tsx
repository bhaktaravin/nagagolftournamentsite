import Link from "next/link";
import { Role } from "@prisma/client";
import { getMember } from "@/lib/auth";

export async function SiteHeader() {
    const member = await getMember();

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-semibold text-fairway">
                    NAGGA
                </Link>
                <nav className="flex items-center gap-4">
                    {member ? (
                        <>
                            {member.role === Role.ADMIN && (
                                <Link
                                    href="/admin"
                                    className="text-[#1a472a] font-medium hover:text-[#2d5a3d]"
                                >
                                    Admin
                                </Link>
                            )}
                            <Link href="/dashboard" className="text-gray-600 hover:text-fairway">
                                Dashboard
                            </Link>
                            <Link href="/dashboard/events" className="text-gray-600 hover:text-fairway">
                                Events
                            </Link>
                            <Link href="/dashboard/members" className="text-gray-600 hover:text-fairway">
                                Members
                            </Link>
                            <Link href="/about" className="text-gray-600 hover:text-fairway">
                                About
                            </Link>
                            <Link href="/dashboard/leaderboard" className="text-gray-600 hover:text-fairway">
                                Leaderboard
                            </Link>
                            <Link href="/dashboard/profile" className="text-gray-600 hover:text-fairway">
                                My Profile
                            </Link>
                            <span className="text-gray-500 hidden sm:inline-block">
                                {member.name || member.phone}
                            </span>
                            <form action="/api/auth/logout" method="POST">
                                <button type="submit" className="btn-secondary text-sm">
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/about" className="text-gray-600 hover:text-fairway">
                                About
                            </Link>
                            <Link href="/contact" className="text-gray-600 hover:text-fairway">
                                Contact
                            </Link>
                            <Link href="/login" className="btn-primary text-sm">
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
