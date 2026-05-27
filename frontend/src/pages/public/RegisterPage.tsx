import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { api, ensureCsrfCookie } from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const setMe = useAuthStore((s) => s.setMe)
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await ensureCsrfCookie()
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      const me = await api.get('/api/me')
      setMe(me.data.user)
      toast.success('Account created.')
      nav('/app/dashboard', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Registration failed.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center lg:px-6">
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
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan Dela Cruz" />
            </div>
            <div className="space-y-2">
              <div className="form-label">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
            </div>
            <div className="space-y-2">
              <div className="form-label">Password</div>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="form-label">Confirm password</div>
              <Input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
            </div>
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
    </div>
  )
}
