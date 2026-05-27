import * as React from 'react'
import { cn } from '../../lib/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-elevated))] px-3 text-sm shadow-sm transition-all duration-200 ease-out',
        'placeholder:text-[rgb(var(--muted))]',
        'hover:border-[rgba(16,185,129,0.55)] hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]',
        'aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-400/40',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'
