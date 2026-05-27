import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageTransition } from '../../components/ui/motion'

export function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,rgb(var(--soft)),rgb(var(--bg))_42%,rgb(var(--bg)))]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={pageTransition}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
