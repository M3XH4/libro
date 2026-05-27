import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function UserProfilePage() {
  const me = useAuthStore((s) => s.me)
  const setMe = useAuthStore((s) => s.setMe)

  const [name, setName] = useState(me?.name ?? '')
  const [email, setEmail] = useState(me?.email ?? '')

  const save = useMutation({
    mutationFn: async () => (await api.put('/api/profile', { name, email })).data,
    onSuccess: (res) => {
      setMe(res.user)
      toast.success('Profile updated.')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Update failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="User Profile"
        title="Your account"
        description="Keep your account details current across Libro."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name and email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="form-label">Name</div>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="form-label">Email</div>
              <Input required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending || name.trim() === '' || email.trim() === ''}>
              {save.isPending ? 'Saving…' : 'Save'}
            </Button>
            <Badge>{me?.role}</Badge>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
