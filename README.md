# 💰 Expense Tracker

A production-quality full-stack personal finance expense tracker built with React, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Tech Stack](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)

---

## ✨ Features

- **Add Expenses** — amount, category, description, and date
- **View Transactions** — sorted list with category icons and color coding
- **Filter & Sort** — filter by category, sort newest/oldest first
- **Summary Dashboard** — total spent, average per expense, per-category breakdown with progress bars
- **Idempotent Submissions** — prevents duplicate expenses on network retries
- **Loading & Error States** — skeleton loaders, form validation, API error messages
- **Responsive Design** — works on mobile, tablet, and desktop

---

## 🏗️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose 8)                |
| Deploy    | Vercel (experimental services)      |

---

## 📂 Project Structure

```
expense-tracker/
├── vercel.json              # Root Vercel config (experimental services)
├── .gitignore
├── README.md
├── backend/
│   ├── api/
│   │   └── index.js         # Vercel serverless entry point
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   └── expenseController.js
│   ├── middleware/
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validateExpense.js
│   ├── models/
│   │   └── Expense.js       # Mongoose schema
│   ├── routes/
│   │   └── expenseRoutes.js
│   ├── server.js            # Express app (exports for Vercel)
│   ├── vercel.json          # Backend rewrites
│   ├── package.json
│   ├── .env.example
│   └── .env                 # (gitignored)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ExpenseForm.jsx
    │   │   ├── ExpenseItem.jsx
    │   │   ├── ExpenseList.jsx
    │   │   ├── FilterBar.jsx
    │   │   └── Summary.jsx
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js        # Axios with auto base URL detection
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
git clone https://github.com/adityarai9123/expense_tracker.git
cd expense_tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Run Both Servers

```bash
# Terminal 1 — Backend
cd backend
npm start        # or: npm run dev (with nodemon)

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ☁️ Vercel Deployment

This project uses **Vercel Experimental Services** to deploy both frontend and backend from a single repo.

### How It Works

| Service   | Route Prefix  | Framework |
|-----------|--------------|-----------|
| Frontend  | `/`          | Vite      |
| Backend   | `/_/backend` | Node.js   |

### Deploy Steps

1. **Push to GitHub** (already done)

2. **Import in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo: `adityarai9123/expense_tracker`
   - Vercel will auto-detect the `vercel.json` at the root

3. **Set Environment Variables** in Vercel dashboard:

   | Key          | Value                                | Service  |
   |-------------|--------------------------------------|----------|
   | `MONGO_URI` | Your MongoDB Atlas connection string | Backend  |
   | `CLIENT_URL`| Your Vercel deployment URL (e.g. `https://expense-tracker-xyz.vercel.app`) | Backend |

4. **Deploy** — Vercel handles the rest!

### Architecture on Vercel

```
Browser → vercel.app/             → Frontend (Vite static)
Browser → vercel.app/_/backend/*  → Backend (Express serverless)
```

The frontend auto-detects production and routes API calls to `/_/backend` — no manual URL configuration needed.

---

## 🔌 API Reference

### `POST /expenses`

Create a new expense.

```json
{
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch at café",
  "date": "2025-01-15",
  "idempotencyKey": "uuid-v4"
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": { "_id": "...", "amount": 25.5, "category": "Food", ... }
}
```

### `GET /expenses`

Fetch all expenses with optional filters.

| Param      | Example       | Description          |
|-----------|---------------|----------------------|
| `category` | `Food`       | Filter by category   |
| `sort`     | `date_desc`  | `date_desc` or `date_asc` |

**Response** `200 OK`:
```json
{
  "success": true,
  "count": 12,
  "total": 847.25,
  "categoryBreakdown": { "Food": 250.00, "Transport": 120.00 },
  "data": [...]
}
```

### `GET /health`

Health check endpoint.

---

## 🎨 Design Decisions

1. **Idempotency Keys** — Every expense submission generates a `crypto.randomUUID()` key. If the same key is re-sent (e.g., network retry), the server returns the existing record instead of creating a duplicate.

2. **Centralized Axios Instance** — All API calls go through a single Axios instance with interceptors for consistent error handling, timeouts, and base URL resolution.

3. **Vercel Experimental Services** — Both frontend and backend deploy from one repo. The backend runs as serverless functions via the `api/index.js` entry point, while the frontend is a standard Vite build.

4. **`require.main === module`** — The Express server only starts listening on a port when run directly (`npm start`). When imported by Vercel's serverless runtime, it exports the app without binding to a port.

5. **MVC Architecture** — Backend follows clean separation: Models → Controllers → Routes → Middleware. Each layer has a single responsibility.

---

## ⚠️ Trade-offs & Limitations

| Decision | Rationale |
|----------|-----------|
| No authentication | Kept minimal for MVP scope |
| No DELETE/PUT endpoints | Focused on create + read per requirements |
| No pagination | Sufficient for personal expense tracking volumes |
| No caching | MongoDB queries are fast enough at this scale |
| Client-side filtering | Server already returns filtered data; client relies on API params |

---

## 🔮 Future Improvements

- [ ] User authentication (JWT or OAuth)
- [ ] Edit and delete expenses
- [ ] Pagination for large datasets
- [ ] Date range filtering
- [ ] Charts and analytics (monthly trends, pie charts)
- [ ] Export to CSV
- [ ] Dark mode toggle
- [ ] PWA support for offline use
- [ ] Budget limits and alerts

---

## 📄 License

MIT
