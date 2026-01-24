import Link from "next/link";

export default function ContactPage() {
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
            <Link href="/about" className="text-gray-600 hover:text-fairway">
              About
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-4 text-2xl font-semibold text-fairway">Contact</h1>
        <p className="mb-6 text-gray-600">
          Get in touch with the North American Gujarati Golf Association.
        </p>

        <div className="card space-y-4">
          <p className="text-gray-600">
            <strong>General inquiries</strong>
          </p>
          <p className="text-gray-600">
            For membership, events, or general questions, please reach out through
            your local NAGGA chapter or at the next event.
          </p>
          <p className="text-gray-600">
            <strong>Website</strong>
            <br />
            <a
              href="https://nagga.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fairway hover:underline"
            >
              nagga.net
            </a>
          </p>
          <p className="text-sm text-gray-500">
            © NAGGA · An offering by Anand Systems Inc
          </p>
        </div>
      </section>
    </main>
  );
}
