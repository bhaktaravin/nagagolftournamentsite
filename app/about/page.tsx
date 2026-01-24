import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-fairway">
            NAGGA
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-fairway">
              Home
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-fairway">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-semibold text-fairway">
          About NAGGA
        </h1>
        <p className="mb-4 text-gray-600">
          <strong>NAGGA (North American Gujarati Golf Association)</strong> brings
          together golfers of Gujarati heritage across North America. We organize
          tournaments, scrambles, and social outings throughout the year.
        </p>
        <p className="mb-4 text-gray-600">
          Our mission is to grow the game of golf within our community, provide
          competitive and fun events for all skill levels, and create lasting
          connections on and off the course.
        </p>
        <p className="mb-8 text-gray-600">
          Membership is open to anyone who shares our love for the game and our
          culture. Join us for the next round.
        </p>

        <Link href="/join" className="btn-primary">
          Join NAGGA
        </Link>
      </section>
    </main>
  );
}
