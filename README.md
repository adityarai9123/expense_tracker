# 💰 FinanceFlow — Personal Finance Tracker

A production-quality full-stack personal finance tracker with income & expense tracking, analytics, and a premium glassmorphic UI.

**🔗 Live Demo:** [Frontend (Vercel)](https://expense-tracker-gamma-six-43.vercel.app) · [Backend API (Render)](https://expense-tracker-be55.onrender.com)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

---

## ✨ Features

### Core
- **Income & Expense Tracking** — toggle between income and expense with separate category lists
- **CRUD Operations** — add, edit, and delete transactions
- **Filter & Sort** — filter by type (income/expense), category, and sort by date
- **Summary Dashboard** — total income, total expenses, net balance, transaction count
- **Category Breakdown** — per-category totals with animated progress bars

### Analytics
- **Donut Chart** — expense distribution by category (animated SVG)
- **Bar Chart** — monthly income vs expense comparison (animated)
- **Recent Activity** — last 7 days transaction feed
- **Quick Stats** — income, expenses, net balance, recent spending

### UI/UX
- **Dark / Light Mode** — toggle with localStorage persistence, no flash on reload
- **Glassmorphism Design** — frosted glass cards, backdrop blur, glowing accents
- **Fixed Navbar** — sticky navigation with FinanceFlow branding and theme toggle
- **Micro-Animations** — fade-in, slide-up, scale-in, staggered list animations
- **Skeleton Loaders** — animated placeholders during data fetch
- **Responsive** — works on mobile, tablet, and desktop

### Reliability
- **Idempotent Submissions** — `crypto.randomUUID()` keys prevent duplicate transactions
- **Double-Click Protection** — submit button disabled during request
- **Form Validation** — client-side + server-side with descriptive error messages
- **Error Handling** — global error handler with correct HTTP status codes
- **Graceful Shutdown** — SIGINT/SIGTERM handlers, EADDRINUSE protection

---

## 🏗️ Tech Stack

| Layer | Technology |
|----------|--------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose 8) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## 📂 Project Structure

```
expense-tracker/
├── backend/
│   ├── api/
│   │   └── index.js              # Serverless entry point
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── expenseController.js  # CRUD + aggregation logic
│   ├── middleware/
│   │   ├── errorHandler.js       # Global error handler
│   │   └── validateExpense.js    # Request validation
│   ├── models/
│   │   └── Expense.js            # Mongoose schema (income/expense)
│   ├── routes/
│   │   └── expenseRoutes.js      # REST routes
│   ├── server.js                 # Express app
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Analytics.jsx     # Charts & analytics dashboard
    │   │   ├── BarChart.jsx      # Monthly income vs expense bars
    │   │   ├── DonutChart.jsx    # Category distribution donut
    │   │   ├── EditModal.jsx     # Edit transaction modal
    │   │   ├── ExpenseForm.jsx   # Add income/expense form
    │   │   ├── ExpenseItem.jsx   # Transaction row with actions
    │   │   ├── ExpenseList.jsx   # Transaction list with delete
    │   │   ├── FilterBar.jsx     # Type/category/sort filters
    │   │   └── Summary.jsx       # Stats cards + category breakdown
    │   ├── pages/
    │   │   └── Dashboard.jsx     # Main page with tabs
    │   ├── services/
    │   │   └── api.js            # Axios instance
    │   ├── App.jsx               # Navbar + theme toggle
    │   ├── main.jsx
    │   └── index.css             # Glassmorphism design system
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18
- MongoDB ([Atlas](https://www.mongodb.com/atlas) or local)

### Setup

```bash
git clone https://github.com/adityarai9123/expense_tracker.git
cd expense_tracker

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI

# Frontend
cd ../frontend
npm install
```

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/expense-tracker
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Run

```bash
# Terminal 1 — Backend
cd backend && npm start

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**

---

## ☁️ Deployment

### Frontend → Vercel
1. Import repo at [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Set environment variable: `VITE_API_BASE_URL` = your Render backend URL
4. Deploy

### Backend → Render
1. Create new Web Service at [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add environment variables: `MONGO_URI`, `NODE_ENV=production`
7. Deploy

---

## 🔌 API Reference

### `POST /expenses`
Create a new transaction.
```json
{
  "type": "expense",
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-01-15",
  "idempotencyKey": "uuid-v4"
}
```

### `GET /expenses`
Fetch transactions with optional filters.

| Param | Values |
|----------|---------------------------|
| `type` | `income`, `expense`, `all` |
| `category` | Any valid category |
| `sort` | `date_desc`, `date_asc` |

**Response** includes: `totalIncome`, `totalExpense`, `netBalance`, `categoryBreakdown`, `monthlyBreakdown`

### `PUT /expenses/:id`
Update a transaction.

### `DELETE /expenses/:id`
Delete a transaction.

### `GET /health`
Health check.

---

## 🎨 Design Decisions

- **Glassmorphism** — frosted glass cards with `backdrop-blur-xl` and subtle borders for a premium feel
- **Dark/Light Mode** — theme restored from `localStorage` before first paint via inline `<script>` to prevent flash
- **Income/Expense Toggle** — form dynamically switches categories and accent colors based on type
- **SVG Charts** — custom-built (no chart library dependency) with CSS animations
- **Idempotency** — prevents duplicate transactions from network retries
- **`require.main === module`** — Express only binds to a port when run directly, not when imported as a module

---

## ⚠️ Trade-offs

| Decision | Rationale |
|----------------------|----------------------------------------|
| No authentication | MVP scope — personal tracker |
| No pagination | Sufficient for personal finance volumes |
| CORS `origin: '*'` | Simplified for cross-origin deployment |
| No chart library | Custom SVG keeps bundle small |

---

## 🔮 Future Improvements

- [ ] User authentication (JWT / OAuth)
- [ ] Budget limits and alerts
- [ ] Date range filtering
- [ ] Export to CSV
- [ ] Recurring transactions
- [ ] PWA offline support
- [ ] Category customization

---

## 📄 License

MIT
