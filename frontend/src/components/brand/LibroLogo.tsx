import { cn } from '../../lib/cn'

type LibroLogoProps = {
  className?: string
  markClassName?: string
  showText?: boolean
  subtitle?: string
}

export function LibroLogo({
  className,
  markClassName,
  showText = true,
  subtitle = 'Library Management',
}: LibroLogoProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <img
        src="/libro-logo.png"
        alt="Libro"
        className={cn(
          'h-11 w-11 shrink-0 rounded-xl object-contain ring-1 ring-[rgba(16,185,129,0.24)]',
          markClassName,
        )}
      />
      {showText && (
        <div className="min-w-0">
          <div className="truncate text-sm font-bold leading-4 text-[rgb(var(--primary-900))]">
            Libro
          </div>
          <div className="truncate text-xs text-[rgb(var(--muted))]">{subtitle}</div>
        </div>
      )}
    </div>
  )
}
