import React, { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProfilePage() {
  const { data, error, mutate } = useSWR('/api/auth/me', fetcher)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Login failed')
        setLoading(false)
        return
      }
      await mutate()
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout')
    mutate()
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        {error && <div className="text-red-600">Failed to fetch profile</div>}

        {!data && (
          <form onSubmit={handleLogin} className="grid gap-3 bg-white/60 dark:bg-neutral-800 p-4 rounded-md">
            <label className="flex flex-col">
              <span className="text-sm">Email or phone</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 border rounded" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 p-2 border rounded" />
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-500 text-white rounded-md">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <Link href="/" className="text-sm text-neutral-600 dark:text-neutral-300">Back to home</Link>
            </div>
          </form>
        )}

        {data && data.user && (
          <div className="bg-white/60 dark:bg-neutral-800 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{data.user.name}</div>
                <div className="text-sm text-neutral-500">{data.user.email || data.user.phone}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded">Logout</button>
                <Link href="/" className="px-3 py-1 bg-primary-500 text-white rounded">Home</Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><strong>Club:</strong> {data.user.club || '—'}</div>
              <div><strong>GHIN:</strong> {data.user.ghin || '—'}</div>
              <div><strong>Phone:</strong> {data.user.phone || '—'}</div>
              <div><strong>ID:</strong> {data.user.id}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
