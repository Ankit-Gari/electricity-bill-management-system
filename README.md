# ⚡ Electricity Bill Management System

A full-stack web application for managing electricity billing — customers can view and pay bills, track payment history, and raise complaints, while admins manage customers, generate bills, and resolve complaints from a central dashboard.

## Tech Stack

| Layer    | Technology                                                          |
| -------- | ------------------------------------------------------------------- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Node.js, Express 5                                                   |
| Database | MySQL (`mysql2` connection pool)                                     |
| Auth     | JWT (Bearer tokens) with bcrypt password hashing                     |

## Architecture

```
┌──────────────────┐        REST (JSON)        ┌──────────────────┐        ┌─────────┐
│   Next.js client │  ───────────────────────▶ │   Express API    │ ─────▶ │  MySQL  │
│   (port 3000)    │   Authorization: Bearer   │   (port 5000)    │  pool  │         │
└──────────────────┘                           └──────────────────┘        └─────────┘
```

- **Role-based access** — separate customer and admin logins; admin-only routes are guarded by an `isAdmin` middleware that checks the JWT's `role` claim.
- **Layered backend** — `routes → middleware → controllers → db pool`, with parameterized queries throughout to prevent SQL injection.

## Project Structure

```
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── login/           # Role-based login (customer / admin)
│   │   ├── admin/           # Dashboard, customers, bills, payments, complaints, inbox
│   │   └── customer/        # Dashboard, bills, payments, complaints, inbox
│   ├── components/          # Layouts, navigation, shadcn/ui primitives
│   └── lib/api.js           # API base URL (NEXT_PUBLIC_API_URL)
├── server/                  # Express backend
│   ├── config/db.js         # MySQL connection pool
│   ├── middleware/          # JWT verification + admin role check
│   ├── controllers/         # Business logic
│   ├── routes/              # API route definitions
│   ├── database/schema.sql  # Tables + sample data
│   └── scripts/             # Password seeding helper
└── package.json             # Root scripts to run both apps together
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Set up the database

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS electricity"
mysql -u root -p electricity < server/database/schema.sql
```

### 3. Configure the server

```bash
cp server/.env.example server/.env
# then edit server/.env with your MySQL credentials and a strong JWT_SECRET
```

### 4. Seed login passwords

Passwords are stored as bcrypt hashes. This sets every customer to `user123` and every admin to `admin123`:

```bash
cd server && npm run seed:passwords
```

### 5. Run both apps

```bash
npm run dev
```

- Client: http://localhost:3000
- API: http://localhost:5000

**Demo credentials** — customer: `john` / `user123` · admin: `admin` / `admin123`

## API Overview

| Method | Endpoint                        | Auth     | Description                          |
| ------ | ------------------------------- | -------- | ------------------------------------ |
| POST   | `/api/auth/login`               | —        | Customer login, returns JWT          |
| POST   | `/api/auth/admin-login`         | —        | Admin login, returns JWT             |
| GET    | `/api/customer/dashboard`       | Customer | Unpaid bills, complaints, recents    |
| GET    | `/api/user/profile`             | Customer | Logged-in user's profile             |
| POST   | `/api/user/change-password`     | Customer | Change password (bcrypt verified)    |
| GET    | `/api/bills/user`               | Customer | Bills for the logged-in user         |
| POST   | `/api/bills/pay`                | Customer | Pay a bill (records payment)         |
| GET    | `/api/bills/paid/user`          | Customer | Logged-in user's payment history     |
| GET    | `/api/inbox`                    | Customer | Messages from the admin              |
| PATCH  | `/api/inbox/:id/read`           | Customer | Mark a message as read               |
| POST   | `/api/inbox`                    | Customer | Submit a complaint/query             |
| GET    | `/api/admin/dashboard`          | Admin    | Totals + recent bills and complaints |
| GET    | `/api/admin/stats`              | Admin    | Revenue and billing statistics       |
| GET    | `/api/admin/users`              | Admin    | All customers (no password hashes)   |
| DELETE | `/api/admin/user/:id`           | Admin    | Delete a customer                    |
| GET    | `/api/bills`                    | Admin    | All bills with customer names        |
| POST   | `/api/admin/bills`              | Admin    | Generate a bill for a customer       |
| DELETE | `/api/bills/:billId`            | Admin    | Delete a bill                        |
| GET    | `/api/bills/paid`               | Admin    | All recorded payments                |
| GET    | `/api/admin/messages`           | Admin    | All customer complaints/queries      |
| PATCH  | `/api/admin/messages/:id`       | Admin    | Update complaint status              |
| POST   | `/api/admin/messages/:id/reply` | Admin    | Reply (delivered to customer inbox)  |

## Security Notes

- Passwords hashed with **bcrypt** (never stored in plain text)
- **JWT** tokens expire after 24 hours; admin routes verify the `role` claim
- All SQL uses **parameterized queries** (`mysql2` placeholders)
- Secrets live in `server/.env` (git-ignored); see `server/.env.example`

## Repository History

This monorepo combines two previously separate repositories with full commit history preserved:
- [`electricity-bill-client`](https://github.com/Ankit-Gari/electricity-bill-client) → `client/`
- [`electricity-bill-management`](https://github.com/Ankit-Gari/electricity-bill-management) → `server/`
