import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { statusTone } from '../../../lib/statusTone'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function BookDetailsPage() {
  const { id } = useParams()
  const me = useAuthStore((s) => s.me)

  const book = useQuery({
    queryKey: ['book', id],
    queryFn: async () => (await api.get(`/api/books/${id}`)).data,
  })

  if (book.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-40" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  const b = book.data?.book
  if (!b) return null

  return (
    <PageShell>
      <PageHeader
        eyebrow="Book Details"
        title={b.title}
        description={`${(b.authors ?? []).map((a: any) => a.name).join(', ') || '—'} · ${b.category?.name ?? 'Uncategorized'}`}
        actions={(me?.role === 'admin' || me?.role === 'librarian') && (
          <Button asChild variant="secondary">
            <Link to={`/app/books/${b.id}/edit`}>Edit</Link>
          </Button>
        )}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Metadata and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
                <div className="text-xs text-[rgb(var(--muted))]">ISBN</div>
                <div className="font-medium">{b.isbn ?? '—'}</div>
              </div>
              <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
                <div className="text-xs text-[rgb(var(--muted))]">Published year</div>
                <div className="font-medium">{b.published_year ?? '—'}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--border))] p-4">
              <div className="text-xs text-[rgb(var(--muted))]">Description</div>
              <div className="mt-1 whitespace-pre-wrap text-[rgb(var(--fg))]">
                {b.description ?? 'No description provided.'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Copies</CardTitle>
            <CardDescription>Availability by physical copy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(b.copies ?? []).length === 0 ? (
              <div className="libro-empty p-6">
                <div className="text-sm font-medium">No copies yet</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">Add copies while editing this book.</div>
              </div>
            ) : (
              (b.copies ?? []).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-[rgb(var(--border))] p-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.barcode}</div>
                    <div className="text-xs text-[rgb(var(--muted))]">{c.shelf_location ?? '—'}</div>
                  </div>
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
