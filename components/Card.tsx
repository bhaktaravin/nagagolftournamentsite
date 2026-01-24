import React from 'react'

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700 rounded p-4 ${className}`}>
      {children}
    </div>
  )
}
