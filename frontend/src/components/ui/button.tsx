import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
}) {
  const Comp: any = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 ease-out',
        'active:scale-[0.98] enabled:hover:-translate-y-0.5 enabled:hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' && 'h-9 px-3',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-11 px-5 text-base',
        variant === 'primary' &&
          'bg-[rgb(var(--primary))] text-white shadow-sm hover:bg-[rgb(var(--primary-700))]',
        variant === 'secondary' &&
          'border border-[rgb(var(--border))] bg-[rgb(var(--soft))] text-[rgb(var(--primary-900))] hover:bg-[rgb(var(--soft-2))]',
        variant === 'ghost' &&
          'bg-transparent text-[rgb(var(--primary-900))] hover:bg-[rgba(16,185,129,0.10)]',
        variant === 'danger' &&
          'bg-red-600 text-white shadow-sm hover:bg-red-700',
        className,
      )}
      {...props}
    />
  )
}
