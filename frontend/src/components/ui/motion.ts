import type { Variants } from 'framer-motion'

export const pageTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
} as const

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -6, filter: 'blur(4px)' },
}

export const cardTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const

export const listVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
}

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}
