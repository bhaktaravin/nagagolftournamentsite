import Image from 'next/image'
import Link from 'next/link'
import Card from '../components/Card'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data, error } = useSWR('/api/tournaments?year=2025', fetcher)

  return (
    <main className="min-h-screen flex flex-col items-start p-6">
      <header className="w-full mb-6">
        <div className="bg-gradient-to-r from-neutral-100/30 dark:from-neutral-900/40 to-transparent p-6 rounded-md flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-28 h-28">
            <Image src="/logo.svg" alt="NAGGA logo" width={112} height={112} priority />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">NAGGA — North American Gujarati Golf Association</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Connecting Gujarati golfers across North America — events, clubs, and community.</p>

                <div className="mt-4 flex items-center gap-3">
                  <Link href="/tournaments" className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-primary-600 transition">
                    Browse Tournaments
                  </Link>

                  <Link href="/tournaments/new" className="inline-flex items-center px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    Create Tournament
                  </Link>
                </div>
          </div>
        </div>
      </header>

      <section className="mt-6 w-full max-w-3xl">
        {error && <Card className="text-red-600">Failed to load tournaments.</Card>}

        {!data && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Card key={n}>
                <div className="animate-pulse">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {data && data.length === 0 && (
          <Card>No tournaments found. <a className="text-primary-500 ml-2" href="/tournaments/new">Create one</a></Card>
        )}

        {data && data.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {data.map((t: any) => (
              <Card key={t.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md bg-primary-500 flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 3v18" />
                      <path d="M5 3c5 0 5 3 10 3s5-3 10-3" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                    <p className="text-sm text-neutral-500">{t.date}</p>
                  </div>
                </div>

                <div className="absolute right-4 top-4 opacity-0 translate-y-1 group-hover:opacity-100 group-focus:opacity-100 group-hover:translate-y-0 group-focus:translate-y-0 transition-all flex gap-2">
                  <Link href={`/tournaments/${t.id}`} className="px-3 py-1 text-sm bg-white/90 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm hover:bg-white">
                    View
                  </Link>
                  <Link href={`/tournaments/${t.id}/register`} className="px-3 py-1 text-sm bg-primary-500 text-white rounded shadow-sm hover:bg-primary-600">
                    Register
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-12 text-sm text-gray-500 w-full">
        Copyright © golfweb.digitalanand.com 2026 All Rights Reserved — an offering by Anand Systems Inc
      </footer>
    </main>
  )
}
