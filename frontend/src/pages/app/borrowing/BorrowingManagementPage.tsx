import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { statusTone } from '../../../lib/statusTone'
import { PageHeader, PageShell } from '../../../components/ui/page'
import { Select } from '../../../components/ui/select'

export function BorrowingManagementPage() {
  const me = useAuthStore((s) => s.me)
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(() => ({ q, status, page, per_page: 10 }), [page, q, status])

  const borrowings = useQuery({
    queryKey: ['borrowings', params],
    queryFn: async () => (await api.get('/api/borrowings', { params })).data,
    placeholderData: (prev) => prev,
  })

  const canProcess = me?.role === 'admin' || me?.role === 'librarian'
  const [borrowUserId, setBorrowUserId] = useState('')
  const [borrowCopyId, setBorrowCopyId] = useState('')

  const borrow = useMutation({
    mutationFn: async () => {
      return (await api.post('/api/borrowings/borrow', { user_id: Number(borrowUserId), book_copy_id: Number(borrowCopyId) })).data
    },
    onSuccess: async () => {
      toast.success('Borrowing created.')
      setBorrowUserId('')
      setBorrowCopyId('')
      await qc.invalidateQueries({ queryKey: ['borrowings'] })
      await qc.invalidateQueries({ queryKey: ['books'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Borrow failed.'),
  })

  const returnBorrowing = useMutation({
    mutationFn: async (id: number) => (await api.post(`/api/borrowings/${id}/return`)).data,
    onSuccess: async () => {
      toast.success('Returned.')
      await qc.invalidateQueries({ queryKey: ['borrowings'] })
      await qc.invalidateQueries({ queryKey: ['books'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Return failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Borrowing Management"
        title={canProcess ? 'Circulation queue & due dates' : 'Your borrowing history'}
        description="Track loans, due dates, returns, and overdue statuses with responsive table controls."
      />

      {canProcess && (
        <Card>
          <CardHeader>
            <CardTitle>Borrow a book</CardTitle>
            <CardDescription>Enter member ID and book copy ID (barcode workflows can be added later).</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input placeholder="Member user_id" value={borrowUserId} onChange={(e) => setBorrowUserId(e.target.value)} />
            <Input placeholder="Book copy id" value={borrowCopyId} onChange={(e) => setBorrowCopyId(e.target.value)} />
            <Button
              onClick={() => borrow.mutate()}
              disabled={borrow.isPending || borrowUserId.trim() === '' || borrowCopyId.trim() === ''}
            >
              {borrow.isPending ? 'Processing…' : 'Borrow'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Borrowings</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Search by book title…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              className="sm:w-72"
            />
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {borrowings.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : (borrowings.data?.data?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No borrowings</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">Borrowing records will appear here.</div>
            </div>
          ) : (
            <div className="libro-table-wrap">
              <table className="libro-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Borrowed</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {borrowings.data.data.map((b: any) => (
                    <tr key={b.id} className="border-b border-[rgb(var(--border))] last:border-0">
                      <td>
                        <div className="font-medium">{b.copy?.book?.title ?? '—'}</div>
                        <div className="text-xs text-[rgb(var(--muted))]">{b.copy?.barcode ?? ''}</div>
                      </td>
                      <td className="text-[rgb(var(--muted))]">
                        {b.user?.name ?? '—'} {canProcess && <span className="text-xs">· #{b.user_id}</span>}
                      </td>
                      <td className="text-[rgb(var(--muted))]">
                        {b.borrowed_at ? new Date(b.borrowed_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="text-[rgb(var(--muted))]">
                        {b.due_at ? new Date(b.due_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                      </td>
                      <td>
                        {!b.returned_at && (
                          <Button
                            variant="secondary"
                            onClick={() => returnBorrowing.mutate(b.id)}
                            disabled={returnBorrowing.isPending}
                          >
                            Return
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
              Page {borrowings.data?.current_page ?? 1} of {borrowings.data?.last_page ?? 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={(borrowings.data?.current_page ?? 1) <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                disabled={(borrowings.data?.current_page ?? 1) >= (borrowings.data?.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
