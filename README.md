# VoltCycle — E-Waste Credits & Circular Rewards Platform 🌿⚡

[![CI & Deployment Check](https://github.com/swapniljadhav0041/ewaste-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/swapniljadhav0041/ewaste-platform/actions/workflows/ci.yml)
[![Repository](https://img.shields.io/badge/GitHub-swapniljadhav0041%2Fewaste--platform-emerald?logo=github)](https://github.com/swapniljadhav0041/ewaste-platform)

A modern full-stack platform enabling citizens to recycle electronic waste responsibly, earn verified reward credits through certified collector inspections, and redeem store vouchers while tracking their personal and community carbon offset.

---

## ⚡ 1-Click Cloud Deployment

### Deploy Frontend to Vercel
Click the button below to deploy the Vite React frontend directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fswapniljadhav0041%2Fewaste-platform&root-directory=client)

> **Vercel Settings:**
> - **Framework Preset**: Vite
> - **Root Directory**: `client`
> - **Build Command**: `npm run build`
> - **Output Directory**: `dist`
> - **Environment Variable**: `VITE_API_URL` = `https://<your-render-backend>.onrender.com/api`

---

### Deploy Backend & PostgreSQL to Render
Use the included `render.yaml` Blueprint to launch the Express API and managed PostgreSQL database:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/swapniljadhav0041/ewaste-platform)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios, Recharts
- **Backend**: Node.js, Express REST API, Zod Schema Validation, Helmet, Rate Limiter
- **Database & ORM**: PostgreSQL with Prisma ORM (supports Neon, Supabase, Render Postgres)
- **Authentication**: JWT + bcrypt with Role-Based Access Control (`USER`, `COLLECTOR`, `ADMIN`)
- **Ledger Model**: Append-only immutable wallet ledger (`EARN`, `REDEEM`, `BONUS`, `ADJUST`)
- **CI/CD**: GitHub Actions automated workflow for unit tests, Prisma generation, and frontend build

---

## 📁 Repository Structure

```
ewaste-platform/
├── .github/workflows/ci.yml    # Automated CI/CD pipeline
├── client/                     # Vite React + Tailwind CSS frontend
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with Bearer interceptor
│   │   ├── components/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext, ToastContext
│   │   └── pages/              # Home, Learn, NewSubmission, Wallet, Offers, Admin, Collector
│   ├── vercel.json             # Vercel SPA rewrite config
│   └── tailwind.config.js      # Emerald brand design tokens
├── server/                     # Node.js Express REST API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma data model & PostgreSQL enum definitions
│   │   └── seed.js             # Initial categories, demo users, sample offers
│   ├── test/                   # Unit test suite for credit calculation logic
│   └── src/
│       ├── controllers/        # Auth, Categories, Submissions, Wallet, Offers, Stats
│       ├── middleware/         # Auth, Role, Upload, Error handler
│       ├── routes/             # REST route endpoints
│       └── services/           # creditService, walletService
├── render.yaml                 # 1-click Render blueprint config
├── vercel.json                 # Monorepo root Vercel config
├── .env.example                # Example environment configuration
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/swapniljadhav0041/ewaste-platform.git
cd ewaste-platform

# Install server & client dependencies
cd server && npm install
cd ../client && npm install
cd ..
npm install
```

### 2. Configure Environment
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

### 3. Initialize Database & Seed
```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

### 4. Run Locally
From the root directory:
```bash
# Starts both Backend (Port 5000) and Frontend (Port 5173) concurrently
npm run dev

# Run credit calculation unit tests
npm run test
```

---

## 👥 Seeded Demo Accounts

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin@ewaste.org` | `Admin123!` | Analytics charts, base rate adjustments, manage offers |
| **Collector** | `collector@ewaste.org` | `Collector123!` | Pickup routes, condition grading (A/B/C), credit approval |
| **Citizen** | `citizen@ewaste.org` | `Citizen123!` | Schedule pickups, track ledger, redeem store vouchers |
