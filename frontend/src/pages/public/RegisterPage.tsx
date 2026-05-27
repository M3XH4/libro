import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setMe = useAuthStore((s) => s.setMe)
  const setLoggingOut = useAuthStore((s) => s.setLoggingOut)
  const queryClient = useQueryClient()
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await ensureCsrfCookie()
      const res = await api.post('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      const user = res.data.user
      setMe(user)
      setLoggingOut(false)
      queryClient.setQueryData(['me'], user)
      toast.success('Account created.')
      nav('/app/dashboard', { replace: true })
    } catch (err: any) {
      const msg = apiErrorMessage(err, 'Registration failed. Please review the form and try again.')
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
            Create your member account.
          </div>
          <div className="mt-3 text-sm text-[rgb(var(--muted))]">
            Get access to the catalog, borrowing history, reservations, notifications, and a responsive member dashboard.
          </div>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="mb-3 lg:hidden">
            <LibroLogo subtitle="Library Management System" />
          </div>
          <CardTitle>Register</CardTitle>
          <CardDescription>Fast setup, polished UI, and role-based access.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="form-label">Full name</div>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" />
            </div>
            <div className="space-y-2">
              <div className="form-label">Email</div>
              <Input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
            </div>
            <div className="space-y-2">
              <div className="form-label">Password</div>
              <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="form-label">Confirm password</div>
              <Input
                required
                type="password"
                value={passwordConfirmation}
                aria-invalid={passwordConfirmation !== '' && password !== passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              {passwordConfirmation !== '' && password !== passwordConfirmation && (
                <div className="libro-validation mt-1 text-xs text-red-600">Passwords do not match.</div>
              )}
            </div>
            {error && (
              <div className="libro-validation rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </Button>
            <div className="text-center text-sm text-[rgb(var(--muted))]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[rgb(var(--primary))] hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
