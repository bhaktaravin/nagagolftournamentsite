import Image from 'next/image'
import Card from '../components/Card'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data, error } = useSWR('/api/tournaments?year=2025', fetcher)

  return (
    <main className="min-h-screen flex flex-col items-start p-6">
      <header className="w-full">
        <div className="flex items-center gap-6">
          <div className="w-48">
            <Image src="https://nagga.net/images/Golf_Logo.png" alt="NAGGA logo" width={240} height={120} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">NAGGA (North American Gujarati Golf Association)</h1>
        </div>
      </header>

      <section className="mt-6 w-full max-w-3xl">
        {error && <Card className="text-red-600">Failed to load tournaments.</Card>}

        {!data && (
          <div className="grid gap-4 md:grid-cols-2">
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
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((t: any) => (
              <Card key={t.id}>
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-sm text-neutral-500">{t.date}</p>
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
