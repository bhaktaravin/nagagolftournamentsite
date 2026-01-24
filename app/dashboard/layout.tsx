import { redirect } from "next/navigation";
import Link from "next/link";
import { getMember } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getMember();
  if (!member) redirect("/");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg font-semibold text-fairway">
            NAGGA
          </Link>
          <nav className="flex items-center gap-6">
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
              Profile
            </Link>
            <span className="text-sm text-gray-500">{member.name || member.phone}</span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="btn-secondary text-sm">
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
