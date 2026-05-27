import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts'
import { BookOpen, CalendarClock, LibraryBig, UsersRound, AlertTriangle } from 'lucide-react'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function DashboardLibrarian() {
  const overview = useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: async () => (await api.get('/api/reports/overview')).data,
  })

  const metrics = [
    { label: 'Books', value: overview.data?.kpis?.books, icon: BookOpen },
    { label: 'Members', value: overview.data?.kpis?.members, icon: UsersRound },
    { label: 'Borrowed', value: overview.data?.kpis?.borrowed_active, icon: LibraryBig },
    { label: 'Overdue', value: overview.data?.kpis?.overdue, icon: AlertTriangle },
    { label: 'Reservations', value: overview.data?.kpis?.active_reservations, icon: CalendarClock },
  ]

  return (
    <PageShell>
      <PageHeader
        eyebrow="Librarian Dashboard"
        title="Operations overview"
        description="A consistent Libro green command center for circulation, inventory, and queue health."
        actions={
          <>
          <Button asChild variant="secondary">
            <Link to="/app/borrowings">Borrowings</Link>
          </Button>
          <Button asChild>
            <Link to="/app/books/new">Add book</Link>
          </Button>
          </>
        }
      />

      {overview.isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardDescription>{label}</CardDescription>
                  <Icon className="h-5 w-5 text-[rgb(var(--primary))]" />
                </div>
                <CardTitle className="text-3xl">{value ?? 0}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Borrowing trend (14 days)</CardTitle>
          <CardDescription>Daily borrowings from circulation logs</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {overview.isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview.data?.trend ?? []}>
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="borrowings"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  isAnimationActive
                  animationDuration={360}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </PageShell>
  )
}
