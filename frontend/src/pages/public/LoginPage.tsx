import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { api, ensureCsrfCookie } from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'
import { pageTransition, pageVariants } from '../../components/ui/motion'

export function LoginPage() {
  const [email, setEmail] = useState('member@libro.test')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const setMe = useAuthStore((s) => s.setMe)
  const nav = useNavigate()
  const loc = useLocation() as any

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await ensureCsrfCookie()
      await api.post('/api/auth/login', { email, password })
      const me = await api.get('/api/me')
      setMe(me.data.user)
      toast.success('Welcome back.')
      nav(loc.state?.from ?? '/app/dashboard', { replace: true })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center lg:px-6"
    >
      <div className="hidden lg:block">
        <div className="libro-panel rounded-2xl p-8">
          <LibroLogo subtitle="Library Management System" />
          <div className="mt-8 text-3xl font-bold tracking-normal">
            Sign in to manage your library workflows.
          </div>
          <div className="mt-3 text-sm text-[rgb(var(--muted))]">
            Catalog, circulation, reservations, analytics, and member tools share one clean Libro green workspace.
          </div>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="mb-3 lg:hidden">
            <LibroLogo subtitle="Library Management System" />
          </div>
          <CardTitle>Login</CardTitle>
          <CardDescription>Use your library account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="form-label">Email</div>
              <Input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
            </div>
            <div className="space-y-2">
              <div className="form-label">Password</div>
              <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <div className="text-center text-sm text-[rgb(var(--muted))]">
              No account?{' '}
              <Link to="/register" className="font-medium text-[rgb(var(--primary))] hover:underline">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
