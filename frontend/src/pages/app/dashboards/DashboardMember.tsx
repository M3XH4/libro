import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookMarked, CalendarClock, WalletCards } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { statusTone } from '../../../lib/statusTone'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function DashboardMember() {
  const me = useAuthStore((s) => s.me)

  const borrowings = useQuery({
    queryKey: ['borrowings', 'me', 'preview'],
    queryFn: async () => (await api.get('/api/borrowings?per_page=5')).data,
  })
  const fines = useQuery({
    queryKey: ['fines', 'me', 'preview'],
    queryFn: async () => (await api.get('/api/fines?per_page=5')).data,
  })
  const reservations = useQuery({
    queryKey: ['reservations', 'me', 'preview'],
    queryFn: async () => (await api.get('/api/reservations?per_page=5')).data,
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Member Dashboard"
        title={`Hi, ${me?.name ?? 'reader'}`}
        description="Your borrowing activity, reservation queue, and fine status in one responsive view."
        actions={
          <>
          <Button asChild variant="secondary">
            <Link to="/app/books">Browse books</Link>
          </Button>
          <Button asChild>
            <Link to="/app/reservations">Reserve a book</Link>
          </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-[rgb(var(--primary))]" />
              Borrowings
            </CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            {borrowings.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {(borrowings.data?.data ?? []).slice(0, 4).map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{b.copy?.book?.title ?? '—'}</div>
                      <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                    </div>
                    <div className="text-xs text-[rgb(var(--muted))]">
                      {b.due_at ? new Date(b.due_at).toLocaleDateString() : '—'}
                    </div>
                  </div>
                ))}
                <Button asChild variant="ghost" className="w-full justify-center">
                  <Link to="/app/borrowings">View all</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[rgb(var(--primary))]" />
              Reservations
            </CardTitle>
            <CardDescription>Queue and expiry tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {(reservations.data?.data ?? []).slice(0, 4).map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.book?.title ?? '—'}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                        <span className="text-xs text-[rgb(var(--muted))]">#{r.position}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[rgb(var(--muted))]">
                      {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : '—'}
                    </div>
                  </div>
                ))}
                <Button asChild variant="ghost" className="w-full justify-center">
                  <Link to="/app/reservations">Manage</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-[rgb(var(--primary))]" />
              Fines
            </CardTitle>
            <CardDescription>Overdue penalties</CardDescription>
          </CardHeader>
          <CardContent>
            {fines.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {(fines.data?.data ?? []).slice(0, 4).map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{f.reason ?? 'Fine'}</div>
                      <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                    </div>
                    <div className="text-sm font-semibold">
                      ₱{(f.amount_cents / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
                <Button asChild variant="ghost" className="w-full justify-center">
                  <Link to="/app/fines">View all</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
