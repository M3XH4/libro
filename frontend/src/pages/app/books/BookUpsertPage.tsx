import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { PageHeader, PageShell } from '../../../components/ui/page'
import { Select } from '../../../components/ui/select'

export function BookUpsertPage({ mode }: { mode: 'create' | 'edit' }) {
  const me = useAuthStore((s) => s.me)
  const { id } = useParams()
  const nav = useNavigate()
  const qc = useQueryClient()

  const canEdit = me?.role === 'admin' || me?.role === 'librarian'

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/api/categories')).data.categories,
  })

  const authors = useQuery({
    queryKey: ['authors', 'all'],
    queryFn: async () => (await api.get('/api/authors')).data.authors,
  })

  const existing = useQuery({
    enabled: mode === 'edit',
    queryKey: ['book', id],
    queryFn: async () => (await api.get(`/api/books/${id}`)).data.book,
  })

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isbn, setIsbn] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [description, setDescription] = useState('')
  const [authorIds, setAuthorIds] = useState<number[]>([])
  const [copies, setCopies] = useState<Array<{ barcode: string; shelf_location?: string }>>([
    { barcode: '' },
  ])

  useEffect(() => {
    if (!existing.data) return
    const b = existing.data
    setTitle(b.title ?? '')
    setSubtitle(b.subtitle ?? '')
    setIsbn(b.isbn ?? '')
    setPublishedYear(b.published_year ? String(b.published_year) : '')
    setCategoryId(b.category_id ? String(b.category_id) : '')
    setDescription(b.description ?? '')
    setAuthorIds((b.authors ?? []).map((a: any) => a.id))
    setCopies(
      (b.copies ?? []).map((c: any) => ({ barcode: c.barcode, shelf_location: c.shelf_location })) || [{ barcode: '' }],
    )
  }, [existing.data])

  const payload = useMemo(
    () => ({
      title,
      subtitle: subtitle || null,
      isbn: isbn || null,
      published_year: publishedYear ? Number(publishedYear) : null,
      category_id: categoryId ? Number(categoryId) : null,
      description: description || null,
      author_ids: authorIds,
      copies:
        mode === 'create'
          ? copies.filter((c) => c.barcode.trim() !== '').map((c) => ({
              barcode: c.barcode.trim(),
              shelf_location: c.shelf_location?.trim() || null,
              status: 'available',
            }))
          : undefined,
    }),
    [authorIds, categoryId, copies, description, isbn, mode, publishedYear, subtitle, title],
  )

  const save = useMutation({
    mutationFn: async () => {
      if (!canEdit) throw new Error('Forbidden')
      if (mode === 'create') return (await api.post('/api/books', payload)).data.book
      return (await api.put(`/api/books/${id}`, payload)).data.book
    },
    onSuccess: async (book) => {
      toast.success(mode === 'create' ? 'Book created.' : 'Book updated.')
      await qc.invalidateQueries({ queryKey: ['books'] })
      nav(`/app/books/${book.id}`, { replace: true })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Save failed.')
    },
  })

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access restricted</CardTitle>
          <CardDescription>Only librarians and admins can add or edit books.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link to="/app/books">Back to catalog</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={mode === 'create' ? 'Add Book' : 'Edit Book'}
        title={mode === 'create' ? 'New title' : 'Update metadata'}
        description="Use consistent Libro forms for metadata, authors, category, description, and initial copies."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Book info</CardTitle>
            <CardDescription>Core metadata used across the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="form-label">Title</div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="form-label">Subtitle</div>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="form-label">ISBN</div>
                <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="form-label">Published year</div>
                <Input value={publishedYear} onChange={(e) => setPublishedYear(e.target.value)} placeholder="2024" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="form-label">Category</div>
              <Select
                className="w-full"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Uncategorized</option>
                {(categories.data ?? []).map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <div className="form-label">Authors</div>
              <div className="grid grid-cols-1 gap-2 rounded-2xl border border-[rgb(var(--border))] p-3 md:grid-cols-2">
                {(authors.data ?? []).slice(0, 12).map((a: any) => {
                  const checked = authorIds.includes(a.id)
                  return (
                    <label key={a.id} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setAuthorIds((prev) =>
                            checked ? prev.filter((x) => x !== a.id) : [...prev, a.id],
                          )
                        }
                      />
                      <span className="truncate">{a.name}</span>
                    </label>
                  )
                })}
                {(authors.data ?? []).length > 12 && (
                  <div className="text-xs text-[rgb(var(--muted))] md:col-span-2">
                    Tip: author search is available in the catalog.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="form-label">Description</div>
              <textarea
                className="min-h-28 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-elevated))] p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary…"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending || title.trim() === ''}>
                {save.isPending ? 'Saving…' : mode === 'create' ? 'Create book' : 'Save changes'}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/app/books">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Copies</CardTitle>
            <CardDescription>{mode === 'create' ? 'Add initial barcodes' : 'Copies are shown on details'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mode === 'edit' ? (
              <div className="text-sm text-[rgb(var(--muted))]">
                Editing copies is intentionally minimal here. View and manage copies from the details screen.
              </div>
            ) : (
              <>
                {copies.map((c, idx) => (
                  <div key={idx} className="space-y-2">
                    <Input
                      placeholder="Barcode (required)"
                      value={c.barcode}
                      onChange={(e) =>
                        setCopies((prev) => prev.map((x, i) => (i === idx ? { ...x, barcode: e.target.value } : x)))
                      }
                    />
                    <Input
                      placeholder="Shelf location (optional)"
                      value={c.shelf_location ?? ''}
                      onChange={(e) =>
                        setCopies((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, shelf_location: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setCopies((prev) => [...prev, { barcode: '' }])}
                >
                  Add another copy
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
