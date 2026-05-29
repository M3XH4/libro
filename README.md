# 📚 Libro - Library Management System

![Laravel](https://img.shields.io/badge/Laravel-12+-FF2D20?style=for-the-badge\&logo=laravel)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge\&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge\&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge\&logo=tailwindcss)

A modern, responsive, and scalable **Library Management System** built with **Laravel**, **React**, and **PostgreSQL**. Libro streamlines library operations by providing powerful tools for managing books, borrowing records, reservations, members, notifications, and analytics through an intuitive green-themed interface.

---

## ✨ Features

### 👨‍💼 Admin Dashboard

* User and role management
* Library analytics and reports
* Fine and penalty management
* Audit logs
* System settings

### 📖 Book Management

* Add, edit, and delete books
* ISBN support
* Book categories and authors
* Book cover uploads
* Multiple copy management
* Availability tracking

### 🔄 Borrowing System

* Borrow and return books
* Due date management
* Overdue tracking
* Borrowing history
* Fine calculation

### 📌 Reservation System

* Reserve unavailable books
* Reservation queue system
* Reservation status tracking

### 👥 Member Management

* Student and member profiles
* Borrowing records
* Activity history

### 📊 Reports & Analytics

* Most borrowed books
* Active members
* Overdue reports
* Borrowing trends
* Exportable reports

### 🔔 Notifications

* Due date reminders
* Overdue alerts
* Reservation notifications

### 🎨 Modern UI

* Green-themed design
* Responsive layout
* Dark mode support
* Interactive animations
* Mobile-first experience

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion
* Zustand

### Backend

* Laravel 12+
* Sanctum Authentication
* REST API
* Laravel Queues

### Database

* PostgreSQL (Supabase)

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Supabase (Database)

---

## 📂 Project Structure

```bash
libro/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── public/
│   └── storage/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── pages/
│   └── assets/
│
└── README.md
```

---

## 🚀 Local Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/libro.git
cd libro
```

---

### Backend Setup

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate
```

Configure your database connection inside `.env`

```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=libro
DB_USERNAME=postgres
DB_PASSWORD=password
```

Run migrations:

```bash
php artisan migrate --seed
```

Start Laravel:

```bash
php artisan serve
```

Backend runs at:

```text
http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🔐 Authentication

Libro uses **Laravel Sanctum** for secure SPA authentication.

Authentication features include:

* Login
* Registration
* Logout
* Protected routes
* Session management
* CSRF protection

---

## 🌐 Deployment

### Frontend

Deploy using:

* Vercel

Environment Variable:

```env
VITE_API_URL=https://your-api.onrender.com
```

---

### Backend

Deploy using:

* Render

Environment Variables:

```env
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

---

### Database

Deploy using:

* Supabase PostgreSQL

---

## 📱 Responsive Design

Libro supports:

* Mobile Phones
* Tablets
* Laptops
* Desktop Monitors

All pages are fully responsive and optimized for modern devices.

---

## 🔮 Future Enhancements

* RFID Integration
* QR Code Borrowing
* Mobile Application
* SMS Notifications
* AI Book Recommendations
* Multi-Branch Library Support
* Digital eBook Reader

---

## 📄 License

This project is licensed under the MIT License.