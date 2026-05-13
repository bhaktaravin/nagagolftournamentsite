import Link from "next/link";
import { getMember } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";

export default async function HomePage() {
  const member = await getMember();

  // If logged in, we can show the dashboard view or just redirect. 
  // For now, let's Redirect to dashboard if they land here, 
  // OR show the landing page with "Dashboard" button. 
  // Given the previous design was exclusive, maybe redirect is better?
  // But standard practice is Landing Page is viewable by all.
  // The SiteHeader handles the "Dashboard" vs "Login" buttons.

  // However, existing users might be confused if they don't see their dashboard.
  // Let's defer to the Header for navigation. 
  // IF member is present, the SiteHeader shows "Dashboard" link.

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-fairway py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('/Golf_Logo.png')] bg-center bg-no-repeat opacity-5 blur-3xl scale-150 mix-blend-overlay"></div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            North American Gujarati <br className="hidden sm:block" />
            <span className="text-sand">Golf Association</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-200">
            Join a thriving community of golf enthusiasts. Compete in premier tournaments, track your handicap, and connect with fellow players across North America.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {member ? (
              <Link href="/dashboard" className="rounded-full bg-sand px-8 py-3 text-lg font-semibold text-fairway transition-colors hover:bg-white">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/join" className="rounded-full bg-sand px-8 py-3 text-lg font-semibold text-fairway transition-colors hover:bg-white">
                  Become a Member
                </Link>
                <Link href="/login" className="rounded-full border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10">
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-fairway">About the Association</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            NAGGA is dedicated to promoting the sport of golf within the community. We organize regular tournaments, social events, and provide a platform for players of all skill levels to network and improve their game. Our mission is to foster sportsmanship, friendship, and cultural connection through the game of golf.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-tee py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fairway/10 text-3xl">
                🏆
              </div>
              <h3 className="mb-3 text-xl font-bold text-fairway">Premier Tournaments</h3>
              <p className="text-gray-600">Participate in effectively organized tournaments at some of the best courses in the region.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fairway/10 text-3xl">
                🤝
              </div>
              <h3 className="mb-3 text-xl font-bold text-fairway">Community</h3>
              <p className="text-gray-600">Connect with a network of professionals and golf lovers. Build lasting friendships on and off the course.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fairway/10 text-3xl">
                📈
              </div>
              <h3 className="mb-3 text-xl font-bold text-fairway">Track Progress</h3>
              <p className="text-gray-600">Maintain your handicap, view leaderboards, and track your improvement season over season.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!member && (
        <section className="bg-fairway py-16 text-center text-white">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-3xl font-bold">Ready to Hit the Links?</h2>
            <p className="mb-8 text-lg text-gray-200">Join NAGGA today and be part of our next event.</p>
            <Link href="/join" className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-fairway shadow-lg transition-transform hover:scale-105">
              Join Now
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white py-12 text-center text-sm text-gray-500">
        <div className="mb-6 flex justify-center gap-6">
          <Link href="/" className="hover:text-fairway">Home</Link>
          <Link href="/about" className="hover:text-fairway">About</Link>
          <Link href="/contact" className="hover:text-fairway">Contact</Link>
          <Link href="/login" className="hover:text-fairway">Login</Link>
        </div>
        <p>© {new Date().getFullYear()} NAGGA · North American Gujarati Golf Association</p>
      </footer>
    </main>
  );
}
