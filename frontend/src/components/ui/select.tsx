import * as React from 'react'
import { cn } from '../../lib/cn'

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-elevated))] px-3 text-sm shadow-sm transition-all duration-200 ease-out',
        'hover:border-[rgba(16,185,129,0.55)] hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]',
        className,
      )}
      {...props}
    />
  )
}
