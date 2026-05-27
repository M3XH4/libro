import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,rgb(var(--soft)),rgb(var(--bg))_42%,rgb(var(--bg)))]">
      <Outlet />
    </div>
  )
}
