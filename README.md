# E-Waste Credits Platform 🌿⚡

A full-stack web platform enabling citizens to recycle electronic waste responsibly, earn verified reward credits, and redeem vouchers while tracking environmental impact (CO₂ saved & materials diverted).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios, Recharts
- **Backend**: Node.js, Express REST API, Zod Schema Validation, Helmet, Rate Limiter
- **ORM & Database**: Prisma ORM, PostgreSQL (with support for hosted instances e.g. Neon/Supabase)
- **Authentication**: JWT, bcrypt password hashing, Role-Based Access Control (`USER`, `COLLECTOR`, `ADMIN`)
- **Ledger Model**: Append-only transactional wallet ledger (`EARN`, `REDEEM`, `BONUS`, `ADJUST`)

---

## 📁 Project Structure

```
ewaste-platform/
├── client/                     # Vite React + Tailwind CSS client
│   ├── src/
│   │   ├── api/                # Axios instance & API modules
│   │   ├── components/         # Navbar, Footer, Badges, Modals, Cards
│   │   ├── context/            # AuthContext & State
│   │   └── pages/              # Home, Learn, Submissions, Wallet, Offers, Admin, Collector
├── server/                     # Node Express server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema & relationships
│   │   └── seed.js             # Seed data for categories, admin, collector, offers
│   └── src/
│       ├── config/             # DB & environment settings
│       ├── middleware/         # auth, role, upload, error handler
│       ├── routes/             # auth, categories, submissions, wallet, offers, stats
│       ├── controllers/        # Business logic controllers
│       ├── services/           # creditService, walletService
│       └── app.js              # Express app entrypoint
├── .env.example                # Example environment variables
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database instance (local or hosted e.g. Neon / Supabase)

### 2. Environment Setup
Copy `.env.example` to `server/.env` and configure your database URL and JWT secret:
```bash
cp .env.example server/.env
```

### 3. Server Setup
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 4. Client Setup
```bash
cd client
npm install
npm run dev
```

---

## 👥 Demo User Accounts (Seeded)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@ewaste.org` | `Admin123!` |
| **Collector** | `collector@ewaste.org` | `Collector123!` |
| **User** | `citizen@ewaste.org` | `Citizen123!` |
