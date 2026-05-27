import { cn } from '../../lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[rgba(16,185,129,0.10)]',
        className,
      )}
    />
  )
}

