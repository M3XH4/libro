import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { PageHeader, PageShell } from '../../../components/ui/page'

export function ReturnBookPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Return Book"
        title="Process returns from Borrowings"
        description="Return actions live inside the borrowing list so status and due-date context stay visible."
      />
      <Card>
        <CardHeader>
          <CardTitle>Return workflow</CardTitle>
          <CardDescription>
            Use the borrowing table to find the active loan and mark it returned.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/app/borrowings">Go to Borrowings</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/books">Find a book</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  )
}
