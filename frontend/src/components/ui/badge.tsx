import * as React from 'react'
import { cn } from '../../lib/cn'

type BadgeTone = 'green' | 'amber' | 'red' | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-[rgba(16,185,129,0.14)] text-[rgb(var(--primary-900))] ring-[rgba(16,185,129,0.24)]',
  amber: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/25',
  red: 'bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-100 dark:ring-red-400/25',
  neutral: 'bg-[rgb(var(--soft))] text-[rgb(var(--muted))] ring-[rgb(var(--border))]',
}

export function Badge({
  className,
  tone = 'green',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
