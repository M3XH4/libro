import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { api } from '../../../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function ReportsPage() {
  const overview = useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: async () => (await api.get('/api/reports/overview')).data,
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Reports & Analytics"
        title="Usage, trends, and top titles"
        description="Operational metrics share the same green hierarchy as the rest of Libro."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {(overview.isLoading ? [0, 1, 2, 3, 4] : []).map((k) => (
          <Skeleton key={k} className="h-28" />
        ))}
        {!overview.isLoading &&
          [
            ['Books', overview.data?.kpis?.books],
            ['Members', overview.data?.kpis?.members],
            ['Borrowed', overview.data?.kpis?.borrowed_active],
            ['Overdue', overview.data?.kpis?.overdue],
            ['Reservations', overview.data?.kpis?.active_reservations],
          ].map(([label, value]) => (
            <Card key={label as string}>
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl">{value ?? 0}</CardTitle>
              </CardHeader>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Borrowings (14 days)</CardTitle>
            <CardDescription>Circulation volume trend</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {overview.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.data?.trend ?? []}>
                  <XAxis dataKey="date" hide />
                  <Tooltip />
                  <Bar
                    dataKey="borrowings"
                    fill="rgb(var(--primary))"
                    radius={[10, 10, 0, 0]}
                    isAnimationActive
                    animationDuration={360}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most borrowed</CardTitle>
            <CardDescription>Top titles across circulation logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {overview.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : (overview.data?.top_books?.length ?? 0) === 0 ? (
              <div className="libro-empty">
                <div className="text-sm font-medium">No data yet</div>
                <div className="mt-1 text-sm text-[rgb(var(--muted))]">Borrowings will populate this report.</div>
              </div>
            ) : (
              overview.data.top_books.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-[rgb(var(--border))] p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{b.title}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Book #{b.id}</div>
                  </div>
                  <Badge>
                    {b.borrow_count} borrows
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
