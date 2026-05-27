import * as React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Libro render error', error, errorInfo)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] px-4 py-10 text-[rgb(var(--fg))]">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center">
          <div className="libro-panel w-full rounded-2xl p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--soft))] text-[rgb(var(--primary))]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-bold">Libro needs a quick refresh</h1>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Something interrupted this screen, but your session is safe. Refresh the app and try again.
            </p>
            <Button className="mt-5" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
