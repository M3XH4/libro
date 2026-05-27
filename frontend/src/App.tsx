import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './app/layouts/PublicLayout'
import { AppLayout } from './app/layouts/AppLayout'
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { NotFoundPage } from './pages/public/NotFoundPage'
import { DashboardAdmin } from './pages/app/dashboards/DashboardAdmin'
import { DashboardLibrarian } from './pages/app/dashboards/DashboardLibrarian'
import { DashboardMember } from './pages/app/dashboards/DashboardMember'
import { BookCatalogPage } from './pages/app/books/BookCatalogPage'
import { BookDetailsPage } from './pages/app/books/BookDetailsPage'
import { BookUpsertPage } from './pages/app/books/BookUpsertPage'
import { BorrowingManagementPage } from './pages/app/borrowing/BorrowingManagementPage'
import { ReturnBookPage } from './pages/app/borrowing/ReturnBookPage'
import { ReservationPage } from './pages/app/reservations/ReservationPage'
import { MembersManagementPage } from './pages/app/members/MembersManagementPage'
import { FinesPage } from './pages/app/fines/FinesPage'
import { ReportsPage } from './pages/app/reports/ReportsPage'
import { NotificationsPage } from './pages/app/notifications/NotificationsPage'
import { SettingsPage } from './pages/app/settings/SettingsPage'
import { UserProfilePage } from './pages/app/profile/UserProfilePage'
import { RequireAuth } from './app/guards/RequireAuth'
import { RequireRole } from './app/guards/RequireRole'
import { useAuthStore } from './stores/authStore'

function DashboardRoute() {
  const role = useAuthStore((s) => s.me?.role)
  if (role === 'admin') return <DashboardAdmin />
  if (role === 'librarian') return <DashboardLibrarian />
  return <DashboardMember />
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardRoute />} />
        <Route
          path="admin"
          element={
            <RequireRole roles={['admin']}>
              <DashboardAdmin />
            </RequireRole>
          }
        />
        <Route
          path="librarian"
          element={
            <RequireRole roles={['librarian', 'admin']}>
              <DashboardLibrarian />
            </RequireRole>
          }
        />

        <Route path="books" element={<BookCatalogPage />} />
        <Route path="books/new" element={<BookUpsertPage mode="create" />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="books/:id/edit" element={<BookUpsertPage mode="edit" />} />

        <Route path="borrowings" element={<BorrowingManagementPage />} />
        <Route path="return" element={<ReturnBookPage />} />
        <Route path="reservations" element={<ReservationPage />} />

        <Route
          path="members"
          element={
            <RequireRole roles={['librarian', 'admin']}>
              <MembersManagementPage />
            </RequireRole>
          }
        />

        <Route path="fines" element={<FinesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
