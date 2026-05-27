import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import { listVariants, pageTransition, pageVariants } from './motion'

export function PageShell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={cn('space-y-5', className)}
      {...(props as any)}
    />
  )
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
    <motion.div
      variants={listVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        <motion.div variants={pageVariants} transition={pageTransition} className="text-sm font-semibold text-[rgb(var(--primary))]">
          {eyebrow}
        </motion.div>
        <motion.h1 variants={pageVariants} transition={pageTransition} className="mt-1 break-words text-2xl font-bold tracking-normal text-[rgb(var(--fg))] sm:text-3xl">
          {title}
        </motion.h1>
        {description && (
          <motion.div variants={pageVariants} transition={pageTransition} className="mt-1 max-w-2xl text-sm text-[rgb(var(--muted))]">
            {description}
          </motion.div>
        )}
      </div>
      {actions && (
        <motion.div variants={pageVariants} transition={pageTransition} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {actions}
        </motion.div>
      )}
    </motion.div>
  )
}
