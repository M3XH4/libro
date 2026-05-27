import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import { Skeleton } from '../../components/ui/skeleton'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useMe()
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    if (isError) nav('/login', { replace: true, state: { from: loc.pathname } })
  }, [isError, loc.pathname, nav])

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

  return <>{children}</>
}

