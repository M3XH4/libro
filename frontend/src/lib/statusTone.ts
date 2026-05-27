type BadgeTone = 'green' | 'amber' | 'red' | 'neutral'

export function statusTone(status?: string): BadgeTone {
  const value = status?.toLowerCase() ?? ''
  if (['active', 'available', 'paid', 'returned', 'read'].includes(value)) return 'green'
  if (['borrowed', 'pending', 'reserved', 'unpaid'].includes(value)) return 'amber'
  if (['overdue', 'cancelled', 'lost', 'waived'].includes(value)) return 'red'
  return 'neutral'
}
