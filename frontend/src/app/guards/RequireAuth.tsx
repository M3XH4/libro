import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import { Skeleton } from '../../components/ui/skeleton'
import { useAuthStore } from '../../stores/authStore'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const me = useAuthStore((s) => s.me)
  const loggingOut = useAuthStore((s) => s.loggingOut)
  const { isLoading, isError } = useMe(!me && !loggingOut)
  const loc = useLocation()

  if (loggingOut) {
    return <Navigate to="/login" replace />
  }

  if (me) return <>{children}</>

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-72" />
        </div>
      </div>
    )
  }

  if (isError) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  return <>{children}</>
}
