import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { statusTone } from '../../../lib/statusTone'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function ReservationPage() {
  const qc = useQueryClient()
  const [bookId, setBookId] = useState('')
  const [page, setPage] = useState(1)

  const reservations = useQuery({
    queryKey: ['reservations', page],
    queryFn: async () => (await api.get('/api/reservations', { params: { page, per_page: 10 } })).data,
    placeholderData: (prev) => prev,
  })

  const create = useMutation({
    mutationFn: async () => (await api.post('/api/reservations', { book_id: Number(bookId) })).data,
    onSuccess: async () => {
      toast.success('Reserved.')
      setBookId('')
      await qc.invalidateQueries({ queryKey: ['reservations'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Reserve failed.'),
  })

  const cancel = useMutation({
    mutationFn: async (id: number) => (await api.post(`/api/reservations/${id}/cancel`)).data,
    onSuccess: async () => {
      toast.success('Cancelled.')
      await qc.invalidateQueries({ queryKey: ['reservations'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Cancel failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Reservations"
        title="Hold a book in the queue"
        description="Create, track, and cancel reservations while keeping queue status easy to scan."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create reservation</CardTitle>
          <CardDescription>Enter a book ID from the catalog details URL.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Input value={bookId} onChange={(e) => setBookId(e.target.value)} placeholder="book_id" />
          <Button onClick={() => create.mutate()} disabled={create.isPending || bookId.trim() === ''}>
            {create.isPending ? 'Reserving…' : 'Reserve'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your reservations</CardTitle>
          <CardDescription>Status, position, and expiration</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : (reservations.data?.data?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No reservations</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">Reserve a title to join its queue.</div>
            </div>
          ) : (
            <div className="libro-table-wrap">
              <table className="libro-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Status</th>
                    <th>Position</th>
                    <th>Expires</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.data.data.map((r: any) => (
                    <tr key={r.id} className="border-b border-[rgb(var(--border))] last:border-0">
                      <td>
                        <div className="font-medium">{r.book?.title ?? '—'}</div>
                        <div className="text-xs text-[rgb(var(--muted))]">#{r.book_id}</div>
                      </td>
                      <td>
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      </td>
                      <td className="text-[rgb(var(--muted))]">#{r.position}</td>
                      <td className="text-[rgb(var(--muted))]">
                        {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {r.status === 'active' && (
                          <Button variant="secondary" onClick={() => cancel.mutate(r.id)} disabled={cancel.isPending}>
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[rgb(var(--muted))]">
              Page {reservations.data?.current_page ?? 1} of {reservations.data?.last_page ?? 1}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={(reservations.data?.current_page ?? 1) <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="secondary" disabled={(reservations.data?.current_page ?? 1) >= (reservations.data?.last_page ?? 1)} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
