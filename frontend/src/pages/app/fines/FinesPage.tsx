import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { statusTone } from '../../../lib/statusTone'
import { PageHeader, PageShell } from '../../../components/ui/page'
import { Select } from '../../../components/ui/select'

export function FinesPage() {
  const me = useAuthStore((s) => s.me)
  const canPay = me?.role === 'admin' || me?.role === 'librarian'
  const qc = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const params = useMemo(() => ({ status, page, per_page: 10 }), [page, status])

  const fines = useQuery({
    queryKey: ['fines', params],
    queryFn: async () => (await api.get('/api/fines', { params })).data,
    placeholderData: (prev) => prev,
  })

  const pay = useMutation({
    mutationFn: async (id: number) => (await api.post(`/api/fines/${id}/pay`)).data,
    onSuccess: async () => {
      toast.success('Fine marked paid.')
      await qc.invalidateQueries({ queryKey: ['fines'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Pay failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Penalties / Fines"
        title="Overdue penalties tracking"
        description="Review fine status, amount, and payment workflow with role-aware actions."
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Fines</CardTitle>
            <CardDescription>Member view is scoped; staff can process payments.</CardDescription>
          </div>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="waived">Waived</option>
          </Select>
        </CardHeader>
        <CardContent>
          {fines.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : (fines.data?.data?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No fines</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">You're all clear.</div>
            </div>
          ) : (
            <div className="libro-table-wrap">
              <table className="libro-table">
                <thead>
                  <tr>
                    <th>Reason</th>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {fines.data.data.map((f: any) => (
                    <tr key={f.id} className="border-b border-[rgb(var(--border))] last:border-0">
                      <td>
                        <div className="font-medium">{f.reason ?? 'Fine'}</div>
                        <div className="text-xs text-[rgb(var(--muted))]">
                          Assessed {f.assessed_at ? new Date(f.assessed_at).toLocaleDateString() : '—'}
                        </div>
                      </td>
                      <td className="text-[rgb(var(--muted))]">{f.user?.name ?? '—'}</td>
                      <td className="font-semibold">₱{(f.amount_cents / 100).toFixed(2)}</td>
                      <td>
                        <Badge tone={statusTone(f.status)}>{f.status}</Badge>
                      </td>
                      <td>
                        {canPay && f.status === 'unpaid' && (
                          <Button variant="secondary" onClick={() => pay.mutate(f.id)} disabled={pay.isPending}>
                            Mark paid
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
              Page {fines.data?.current_page ?? 1} of {fines.data?.last_page ?? 1}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={(fines.data?.current_page ?? 1) <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="secondary" disabled={(fines.data?.current_page ?? 1) >= (fines.data?.last_page ?? 1)} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
