import * as React from 'react'
import { cn } from '../../lib/cn'

export function PageShell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-5', className)} {...props} />
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[rgb(var(--primary))]">{eyebrow}</div>
        <h1 className="mt-1 break-words text-2xl font-bold tracking-normal text-[rgb(var(--fg))] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <div className="mt-1 max-w-2xl text-sm text-[rgb(var(--muted))]">{description}</div>
        )}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{actions}</div>}
    </div>
  )
}
