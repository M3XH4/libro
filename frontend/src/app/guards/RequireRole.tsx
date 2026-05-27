import { Navigate } from 'react-router-dom'
import { useAuthStore, type Role } from '../../stores/authStore'

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[]
  children: React.ReactNode
}) {
  const me = useAuthStore((s) => s.me)
  if (!me) return <Navigate to="/login" replace />
  if (!roles.includes(me.role)) return <Navigate to="/app/dashboard" replace />
  return <>{children}</>
}

