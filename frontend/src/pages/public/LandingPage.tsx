import { Link } from 'react-router-dom'
import { BookOpenCheck, ShieldCheck, } from 'lucide-react'
import { LibroLogo } from '../../components/brand/LibroLogo'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-6">
      <header className="flex items-center justify-between gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card)/0.88)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
        <LibroLogo subtitle="Library Management System" />
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="min-w-0">
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal text-[rgb(var(--fg))] sm:text-5xl">
            Libro Library Management System
          </h1>
          <p className="mt-4 max-w-xl text-base text-[rgb(var(--muted))]">
            A polished circulation workspace for cataloging books, managing copies, borrowing,
            returns, reservations, members, fines, and analytics with one consistent emerald interface.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/register">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-xs text-[rgb(var(--muted))] shadow-[var(--shadow-soft)]">
            Demo accounts: <span className="font-semibold text-[rgb(var(--fg))]">admin@libro.test</span>,{' '}
            <span className="font-semibold text-[rgb(var(--fg))]">librarian@libro.test</span>,{' '}
            <span className="font-semibold text-[rgb(var(--fg))]">member@libro.test</span>. Password:{' '}
            <span className="font-semibold text-[rgb(var(--fg))]">password</span>.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-[rgb(var(--primary))]" />
                Catalog & Copies
              </CardTitle>
              <CardDescription>Track titles, authors, categories, and physical copies.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[rgb(var(--muted))]">
              Fast search + filters, availability counts, cover uploads, and clean detail pages.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[rgb(var(--primary))]" />
                Role-based Access
              </CardTitle>
              <CardDescription>Admin, Librarian, Member flows.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[rgb(var(--muted))]">
              Permissions enforced server-side; UI adapts based on role with responsive navigation.
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Borrowing, Returns, Reservations</CardTitle>
              <CardDescription>End-to-end circulation with status, due dates, and queueing.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[rgb(var(--muted))]">
              Includes loading skeletons, empty states, toast feedback, and accessible contrast in light/dark themes.
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="mt-14 border-t border-[rgb(var(--border))] pt-6 text-xs text-[rgb(var(--muted))]">
         <p>&copy; Libro 2026. All rights reserved.</p>
      </footer>
    </div>
  )
}
