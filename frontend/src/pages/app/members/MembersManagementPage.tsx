import { useMemo, useState } from 'react'
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

export function MembersManagementPage() {
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const params = useMemo(() => ({ q, page, per_page: 10 }), [page, q])

  const members = useQuery({
    queryKey: ['members', params],
    queryFn: async () => (await api.get('/api/members', { params })).data,
    placeholderData: (prev) => prev,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password')
  const [passwordConfirmation, setPasswordConfirmation] = useState('password')

  const create = useMutation({
    mutationFn: async () =>
      (await api.post('/api/members', { name, email, password, password_confirmation: passwordConfirmation })).data,
    onSuccess: async () => {
      toast.success('Member added.')
      setName('')
      setEmail('')
      await qc.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Create failed.'),
  })

  const remove = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/api/members/${id}`)).data,
    onSuccess: async () => {
      toast.success('Member deleted.')
      await qc.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Delete failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Members"
        title="Manage library members"
        description="Create accounts, search users, and keep member records readable on every screen size."
      />

      <Card>
        <CardHeader>
          <CardTitle>Add member</CardTitle>
          <CardDescription>Creates a new member account (default password: password).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button
            onClick={() => create.mutate()}
            disabled={create.isPending || name.trim() === '' || email.trim() === '' || password !== passwordConfirmation}
          >
            {create.isPending ? 'Creating…' : 'Create'}
          </Button>
          <div className="md:col-span-4">
            <Input
              type="password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {password !== passwordConfirmation && (
              <div className="mt-1 text-xs text-red-600">Passwords do not match.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Member list</CardTitle>
          <Input
            placeholder="Search name/email…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className="sm:w-72"
          />
        </CardHeader>
        <CardContent>
          {members.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : (members.data?.data?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No members</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">Create a member to get started.</div>
            </div>
          ) : (
            <div className="libro-table-wrap">
              <table className="libro-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {members.data.data.map((m: any) => (
                    <tr key={m.id} className="border-b border-[rgb(var(--border))] last:border-0">
                      <td className="font-medium">{m.name}</td>
                      <td className="text-[rgb(var(--muted))]">{m.email}</td>
                      <td>
                        <Badge tone={statusTone(m.settings?.member_status ?? 'active')}>
                          {m.settings?.member_status ?? 'active'}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => remove.mutate(m.id)} disabled={remove.isPending}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-[rgb(var(--muted))]">
              Page {members.data?.current_page ?? 1} of {members.data?.last_page ?? 1}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={(members.data?.current_page ?? 1) <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              <Button variant="secondary" disabled={(members.data?.current_page ?? 1) >= (members.data?.last_page ?? 1)} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
