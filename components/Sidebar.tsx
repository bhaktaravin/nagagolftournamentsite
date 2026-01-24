import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const router = useRouter()
  const links = [
    { href: '/', label: 'My Profile', icon: 'user' },
    { href: '/clubs', label: 'My Clubs', icon: 'clubs' },
    { href: '/tournaments', label: 'Tournaments', icon: 'flag' },
    { href: '/logout', label: 'Logout', icon: 'logout' }
  ]
  return (
    <aside
      className={`z-40 fixed inset-y-0 left-0 transform bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-md w-60 transition-transform md:static md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full md:-translate-x-0'
      }`}
      aria-hidden={!open && typeof window !== 'undefined' && window.innerWidth < 768}
    >
      <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-semibold text-lg">Menu</span>
        <button onClick={onToggle} aria-label="Toggle sidebar" aria-expanded={open} className="p-1 md:hidden">
          {open ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      <nav className="px-2 py-4 overflow-y-auto h-[calc(100vh-64px)]" role="navigation" aria-label="Main sidebar">
        {links.map((l) => {
          const active = router.pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-4 py-2 my-1 rounded-md transition ${
                active
                  ? 'bg-primary-50/20 dark:bg-neutral-800 font-semibold border-l-4 border-primary-500 pl-3'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="w-5 h-5 text-neutral-400 dark:text-neutral-400">
                  {l.icon === 'user' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-3-3.87" />
                      <path d="M4 21v-2a4 4 0 013-3.87" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                  {l.icon === 'clubs' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20" />
                      <path d="M5 8a4 4 0 017-3.2" />
                    </svg>
                  )}
                  {l.icon === 'flag' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 3v18" />
                      <path d="M5 3c5 0 5 3 10 3s5-3 10-3" />
                    </svg>
                  )}
                  {l.icon === 'logout' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{l.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
