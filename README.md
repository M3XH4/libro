# Libro — Laravel + React Library Management System

Green-themed, Stitch-style modern **Library Management Web System** built with:

- **Backend**: Laravel (API) + Sanctum (SPA auth) + Queues + Notifications
- **Frontend**: React 19 + Vite + Tailwind + Radix/shadcn-style UI + React Query + Zustand

## Features

- **Auth**: register, login, logout, forgot/reset password (API), role-based access
- **Roles**: `admin`, `librarian`, `member`
- **Books**: add/edit/delete books, authors, categories, physical copies, cover upload
- **Borrowing**: borrow, return, due dates, overdue status, history
- **Reservations**: reserve, cancel, queue position and expiration
- **Members**: add/list/delete members (staff only)
- **Fines**: list fines and mark paid (staff only)
- **Reports**: KPIs + trends + top borrowed books (staff only)
- **UI/UX**: responsive sidebar + top navbar, cards, tables, search/filter, toasts, skeletons, empty states, dark mode

## Repo layout

- `backend/` — Laravel API
- `frontend/` — React SPA

## Local setup (Windows)

### Backend (Laravel)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --port=8000
```

### Frontend (React)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the SPA at `http://localhost:5173/`.

## Seeded demo accounts

All use password `password`:

- `admin@libro.test`
- `librarian@libro.test`
- `member@libro.test`

## Deployment guide (high level)

- Build frontend:

```bash
cd frontend
npm run build
```

- Serve the built frontend (any static host) and point `VITE_API_URL` to your backend URL.
- Configure Laravel:
  - Set `APP_URL`, `FRONTEND_URL`, `SANCTUM_STATEFUL_DOMAINS`
  - Use a persistent DB (MySQL/PostgreSQL recommended)
  - Configure `QUEUE_CONNECTION` (database/redis) and run a queue worker
  - Enable HTTPS for secure cookies in production
