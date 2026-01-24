import React from 'react'

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      tabIndex={0}
      className={`group bg-white/60 dark:bg-neutral-800 border border-neutral-700 rounded-md p-4 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition ${className}`}
      role="group"
    >
      {children}
    </div>
  )
}
