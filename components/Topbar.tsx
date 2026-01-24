import React, { useEffect, useState } from 'react'

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark')
      setDark(false)
    } else {
      // match system preference
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefers) {
        document.documentElement.classList.add('dark')
        setDark(true)
      }
    }
  }, [])

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    setDark(isDark)
  }

  return (
    <header className="bg-neutral-800 text-white p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden p-1" aria-label="Toggle menu">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="font-semibold">Menu</div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleDark} aria-pressed={dark} aria-label="Toggle dark mode" className="p-1">
          {dark ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>

        <div className="text-sm">Welcome: Rohit</div>
      </div>
    </header>
  )
}
