import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { api, ensureCsrfCookie } from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'
import { pageTransition, pageVariants } from '../../components/ui/motion'
import { apiErrorMessage } from '../../lib/errors'

export function LoginPage() {
  const [email, setEmail] = useState('member@libro.test')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setMe = useAuthStore((s) => s.setMe)
  const setLoggingOut = useAuthStore((s) => s.setLoggingOut)
  const queryClient = useQueryClient()
  const nav = useNavigate()
  const loc = useLocation() as any

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await ensureCsrfCookie()
      const res = await api.post('/api/auth/login', { email, password })
      const user = res.data.user
      setMe(user)
      setLoggingOut(false)
      queryClient.setQueryData(['me'], user)
      toast.success('Welcome back.')
      nav(loc.state?.from ?? '/app/dashboard', { replace: true })
    } catch (err: any) {
      const msg = apiErrorMessage(err, 'Login failed. Please check your credentials and try again.')
      setError(msg)
      toast.error(msg)
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
      className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-4 pb-8 pt-20 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-8"
    >
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full bg-[rgb(var(--card)/0.78)] shadow-sm backdrop-blur">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>

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
            {error && (
              <div className="libro-validation rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
                {error}
              </div>
            )}
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
