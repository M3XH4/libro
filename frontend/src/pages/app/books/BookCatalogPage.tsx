import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Badge } from '../../../components/ui/badge'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function BookCatalogPage() {
  const me = useAuthStore((s) => s.me)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(() => ({ q, page, per_page: 10 }), [page, q])
  const books = useQuery({
    queryKey: ['books', params],
    queryFn: async () => (await api.get('/api/books', { params })).data,
    placeholderData: (prev) => prev,
  })

  return (
    <PageShell>
      <PageHeader
        eyebrow="Book Catalog"
        title="Browse, search, and manage books"
        description="Search titles, inspect availability, and keep records aligned across the collection."
        actions={(me?.role === 'admin' || me?.role === 'librarian') && (
          <Button asChild>
            <Link to="/app/books/new">
              <Plus className="h-4 w-4" /> Add book
            </Link>
          </Button>
        )}
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Catalog</CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
            <Input
              className="pl-9"
              placeholder="Search title, ISBN, author…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {books.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : (books.data?.data?.length ?? 0) === 0 ? (
            <div className="libro-empty">
              <div className="text-sm font-medium">No books found</div>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                Try a different search, or add a new title to the catalog.
              </div>
            </div>
          ) : (
            <div className="libro-table-wrap">
              <table className="libro-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Authors</th>
                    <th>Category</th>
                    <th>Availability</th>
                    <th>ISBN</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {books.data.data.map((b: any) => (
                    <tr key={b.id} className="border-b border-[rgb(var(--border))] last:border-0">
                      <td>
                        <div className="font-medium">{b.title}</div>
                        {b.subtitle && <div className="text-xs text-[rgb(var(--muted))]">{b.subtitle}</div>}
                      </td>
                      <td className="text-[rgb(var(--muted))]">
                        {(b.authors ?? []).map((a: any) => a.name).join(', ') || '—'}
                      </td>
                      <td className="text-[rgb(var(--muted))]">{b.category?.name ?? '—'}</td>
                      <td>
                        <Badge>
                          {b.available_copies ?? 0}/{b.total_copies ?? 0} available
                        </Badge>
                      </td>
                      <td className="text-[rgb(var(--muted))]">{b.isbn ?? '—'}</td>
                      <td>
                        <Button asChild variant="ghost">
                          <Link to={`/app/books/${b.id}`}>View</Link>
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
              Page {books.data?.current_page ?? 1} of {books.data?.last_page ?? 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={(books.data?.current_page ?? 1) <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                disabled={(books.data?.current_page ?? 1) >= (books.data?.last_page ?? 1)}
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
