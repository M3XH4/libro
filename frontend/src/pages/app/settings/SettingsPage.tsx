import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function SettingsPage() {
  const darkMode = useAuthStore((s) => s.darkMode)
  const setDarkMode = useAuthStore((s) => s.setDarkMode)

  const save = useMutation({
    mutationFn: async (payload: any) => (await api.put('/api/settings', payload)).data,
    onSuccess: () => toast.success('Settings saved.'),
    onError: () => toast.error('Save failed.'),
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        description="Control appearance and notification preferences without leaving the Libro design system."
      />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Accessible contrast with light/dark support</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium">Dark mode</div>
            <div className="text-sm text-[rgb(var(--muted))]">Toggles the UI theme.</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const next = !darkMode
                setDarkMode(next)
                save.mutate({ dark_mode: next })
              }}
            >
              {darkMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Basic toggles (email delivery can be wired via queues)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium">Email reminders</div>
            <div className="text-sm text-[rgb(var(--muted))]">Due date reminders and reservation updates.</div>
          </div>
          <Button
            variant="secondary"
            onClick={() => save.mutate({ notifications_email: true })}
          >
            Enable
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  )
}
