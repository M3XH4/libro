import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { BookOpen, Bell, ChartPie, Home, Settings, Users, Handshake, ScrollText, UserRound, LogOut, Menu, SunMedium, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { pageTransition } from '../../components/ui/motion'
import { cn } from '../../lib/cn'
import { api, ensureCsrfCookie } from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'

type NavItem = { to: string; label: string; icon: React.ReactNode; roles?: Array<'admin' | 'librarian' | 'member'> }

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const me = useAuthStore((s) => s.me)
  const setMe = useAuthStore((s) => s.setMe)
  const setLoggingOut = useAuthStore((s) => s.setLoggingOut)
  const darkMode = useAuthStore((s) => s.darkMode)
  const setDarkMode = useAuthStore((s) => s.setDarkMode)
  const nav = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const items = useMemo<NavItem[]>(
    () => [
      { to: '/app/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
      { to: '/app/books', label: 'Book Catalog', icon: <BookOpen className="h-4 w-4" /> },
      { to: '/app/borrowings', label: 'Borrowing', icon: <Handshake className="h-4 w-4" /> },
      { to: '/app/return', label: 'Return Book', icon: <ScrollText className="h-4 w-4" /> },
      { to: '/app/reservations', label: 'Reservations', icon: <ScrollText className="h-4 w-4" /> },
      { to: '/app/members', label: 'Members', icon: <Users className="h-4 w-4" />, roles: ['admin', 'librarian'] },
      { to: '/app/fines', label: 'Fines', icon: <ScrollText className="h-4 w-4" /> },
      { to: '/app/reports', label: 'Reports & Analytics', icon: <ChartPie className="h-4 w-4" />, roles: ['admin', 'librarian'] },
      { to: '/app/notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
      { to: '/app/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
      { to: '/app/profile', label: 'Profile', icon: <UserRound className="h-4 w-4" /> },
    ],
    [],
  )

  const visibleItems = items.filter((it) => !it.roles || (me && it.roles.includes(me.role)))

  async function onLogout() {
    setLoggingOut(true)
    try {
      await ensureCsrfCookie()
      await api.post('/api/auth/logout')
      setMe(null)
      queryClient.removeQueries({ queryKey: ['me'] })
      toast.success('Logged out.')
      nav('/login', { replace: true })
    } catch {
      setLoggingOut(false)
      toast.error('Logout failed.')
    }
  }

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--sidebar))]">
      <div className="flex items-center justify-between px-5 py-4">
        <LibroLogo />
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-4">
        {visibleItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                'hover:-translate-y-0.5 hover:shadow-sm',
                isActive
                  ? 'bg-[rgb(var(--soft))] text-[rgb(var(--primary-900))] ring-1 ring-[rgba(16,185,129,0.24)]'
                  : 'text-[rgb(var(--muted))] hover:bg-[rgba(16,185,129,0.09)] hover:text-[rgb(var(--primary-900))]',
              )
            }
          >
            {it.icon}
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[rgb(var(--border))] p-3">
        <Button variant="secondary" className="w-full justify-between" onClick={onLogout}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </span>
          <span className="text-xs text-[rgb(var(--muted))]">{me?.role ?? ''}</span>
        </Button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <div className="hidden lg:block">{Sidebar}</div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-72 shadow-2xl"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {Sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--nav)/0.92)] backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--nav)/0.78)]">
            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <Button
                  variant="ghost"
                  className="h-10 w-10 px-0 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <LibroLogo showText={false} markClassName="h-9 w-9 lg:hidden" />
                <div className="min-w-0">
                  <div className="text-sm font-bold leading-4 text-[rgb(var(--primary-900))]">Welcome back</div>
                  <div className="truncate text-xs text-[rgb(var(--muted))]">
                    {me ? `${me.name} · ${me.email}` : 'Loading...'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDarkMode(!darkMode)}
                  title="Toggle dark mode"
                  aria-label="Toggle dark mode"
                  className="px-3"
                >
                  {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:py-6 lg:px-6">
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
          </main>
        </div>
      </div>
    </div>
  )
}
