export function apiErrorMessage(error: unknown, fallback: string) {
  const err = error as any
  const data = err?.response?.data

  if (typeof data?.message === 'string') return data.message

  const errors = data?.errors
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors).flat().find(Boolean)
    if (typeof first === 'string') return first
  }

  if (typeof err?.message === 'string' && err.message !== 'Network Error') {
    return err.message
  }

  return fallback
}
