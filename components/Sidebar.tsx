import Link from 'next/link'

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside
      className={`z-40 fixed inset-y-0 left-0 transform bg-white dark:bg-neutral-800 shadow-sm w-56 transition-transform md:static md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full md:-translate-x-0'
      }`}
      aria-hidden={!open && typeof window !== 'undefined' && window.innerWidth < 768}
    >
      <div className="p-3 flex items-center justify-between">
        <span className="font-semibold">Menu</span>
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
      <nav className="px-2" role="navigation" aria-label="Main sidebar">
        <Link href="/">
          <a className="block py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">My Profile</a>
        </Link>
        <Link href="/clubs">
          <a className="block py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">My Clubs</a>
        </Link>
        <Link href="/tournaments">
          <a className="block py-2 rounded bg-neutral-50 dark:bg-neutral-700">Tournaments</a>
        </Link>
        <Link href="/logout">
          <a className="block py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700">Logout</a>
        </Link>
      </nav>
    </aside>
  )
}
