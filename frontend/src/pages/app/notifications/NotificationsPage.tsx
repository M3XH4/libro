import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function NotificationsPage() {
  const qc = useQueryClient()
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/api/notifications')).data,
  })

  const markRead = useMutation({
    mutationFn: async (id: string) => (await api.post(`/api/notifications/${id}/read`)).data,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: () => toast.error('Failed to mark read.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Notifications"
        title="Updates and reminders"
        description="Unread reminders, due dates, and reservation events stay aligned with the green Libro UI."
      />

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            {notifications.data?.unread_count ?? 0} unread
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : (notifications.data?.notifications?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No notifications</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">You’re up to date.</div>
            </div>
          ) : (
            notifications.data.notifications.map((n: any) => (
              <div key={n.id} className="flex flex-col gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-elevated))] p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n.type}</div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                    {typeof n.data === 'string' ? n.data : JSON.stringify(n.data)}
                  </div>
                  <div className="mt-2 text-xs text-[rgb(var(--muted))]">
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                  </div>
                </div>
                {!n.read_at && (
                  <Button variant="secondary" size="sm" onClick={() => markRead.mutate(n.id)} disabled={markRead.isPending}>
                    Mark read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageShell>
  )
}
