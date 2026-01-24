import Link from "next/link";
import { getMember } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { SiteHeader } from "@/components/SiteHeader";

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
        <SiteHeader />
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
        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
          <Link href="/about" className="hover:text-fairway">About</Link>
          <Link href="/contact" className="hover:text-fairway">Contact</Link>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          © NAGGA · An offering by Anand Systems Inc
        </p>
      </div>
    </main>
  );
}
