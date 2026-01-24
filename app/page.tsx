import Link from "next/link";
import { getMember } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string }>;
}) {
  const member = await getMember();
  const { joined } = await searchParams;

  if (member) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-semibold text-fairway">
              NAGGA
            </Link>
            <nav className="flex items-center gap-4">
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
              <span className="text-gray-500">{member.name || member.phone}</span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="btn-secondary text-sm">
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="mb-2 text-2xl font-semibold text-fairway">
            Welcome back, {member.name || "Member"}!
          </h1>
          <p className="mb-8 text-gray-600">
            You’re logged in as a NAGGA member. Visit your dashboard to manage events and profile.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/events" className="btn-secondary">
              Browse Events
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-tee to-sand/50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-fairway">NAGGA</h1>
          <p className="mt-1 text-gray-600">
            North American Gujarati Golf Association
          </p>
        </div>
        <div className="card">
          {joined === "1" && (
            <p className="mb-4 rounded-lg bg-green/20 py-2 text-center text-sm text-fairway">
              You’ve joined NAGGA! Log in with your phone and zipcode below.
            </p>
          )}
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-500">
            New to NAGGA?{" "}
            <Link href="/join" className="font-medium text-fairway hover:underline">
              Join as a member
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">
          © NAGGA · An offering by Anand Systems Inc
        </p>
      </div>
    </main>
  );
}
