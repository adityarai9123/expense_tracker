# 💰 Expense Tracker

A production-quality full-stack personal finance expense tracker built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 📸 Features

- ✅ Add expenses with amount, category, description, and date
- ✅ Filter by category and sort by date (newest/oldest)
- ✅ Total expense summary with per-category breakdown bar chart
- ✅ Idempotent API (safe to retry — no duplicate expenses)
- ✅ Loading skeletons, error states, and disabled submit on pending
- ✅ Responsive design (mobile + desktop)
- ✅ Clean MVC backend with input validation and global error handling

---

## 🗂 Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Expense.js            # Mongoose schema
│   ├── controllers/
│   │   └── expenseController.js  # Business logic
│   ├── routes/
│   │   └── expenseRoutes.js      # Route definitions
│   └── middleware/
│       ├── validateExpense.js    # Request validation
│       └── errorHandler.js       # Global error handler
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css             # Tailwind + custom utilities
        ├── services/
        │   └── api.js            # Axios instance + API calls
        ├── pages/
        │   └── Dashboard.jsx     # Main page layout + state
        └── components/
            ├── ExpenseForm.jsx   # Add expense form
            ├── ExpenseList.jsx   # List container + skeleton
            ├── ExpenseItem.jsx   # Single expense row
            ├── FilterBar.jsx     # Category filter + sort
            └── Summary.jsx       # Totals + category bars
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works) **or** local MongoDB
- npm or yarn

---

### 1. Clone / Download

```bash
# If you cloned the repo:
cd expense-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

| Variable     | Required | Default                   | Description                       |
|--------------|----------|---------------------------|-----------------------------------|
| `PORT`       | No       | `5000`                    | Express server port               |
| `MONGO_URI`  | **Yes**  | —                         | MongoDB connection string         |
| `CLIENT_URL` | No       | `http://localhost:5173`   | Allowed CORS origin               |

### Frontend (`frontend/.env`)

| Variable              | Required | Default                  | Description            |
|-----------------------|----------|--------------------------|------------------------|
| `VITE_API_BASE_URL`   | No       | `http://localhost:5000`  | Backend base URL       |

---

## 📡 API Reference

### `POST /expenses`

Create a new expense.

**Request Body:**
```json
{
  "amount": 24.99,
  "category": "Food",
  "description": "Lunch at café",
  "date": "2024-01-15",
  "idempotencyKey": "uuid-here"
}
```

**Responses:**
- `201 Created` — expense created successfully
- `200 OK` — duplicate detected, returns existing record (`duplicate: true`)
- `400 Bad Request` — validation failed

---

### `GET /expenses`

Fetch expenses with optional filters.

**Query Params:**
| Param      | Description                              | Example            |
|------------|------------------------------------------|--------------------|
| `category` | Filter by category name                  | `?category=Food`   |
| `sort`     | `date_desc` (default) or `date_asc`      | `?sort=date_asc`   |

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 142.50,
  "categoryBreakdown": {
    "Food": 42.50,
    "Transport": 100.00
  },
  "data": [...]
}
```

---

### `GET /health`

Health check endpoint.

```json
{ "status": "ok", "timestamp": "..." }
```

---

## 🏗 Key Design Decisions

### Idempotency
Each form submission generates a client-side `idempotencyKey` (UUID). On the backend, this key is stored as a unique index in MongoDB. If a duplicate key is detected (e.g., user double-clicks or retries after a network failure), the server returns the existing record with `duplicate: true` instead of creating a duplicate — ensuring exactly-once semantics.

### Money Handling
Amounts are stored as `Number` in MongoDB with a Mongoose `set` hook that rounds to 2 decimal places (`parseFloat(v.toFixed(2))`). This avoids floating-point drift. For high-precision financial applications, `Decimal128` or storing as integer cents would be preferred.

### MVC Pattern
The backend follows a strict Model → Controller → Route separation:
- **Models** define schema and database structure
- **Controllers** contain all business logic
- **Routes** are thin — they only wire HTTP verbs to controllers
- **Middleware** handles cross-cutting concerns (validation, error handling)

### Axios Centralization
All HTTP calls go through a single Axios instance (`src/services/api.js`) with:
- A shared base URL from environment
- A 12-second timeout
- A response interceptor that normalizes all error formats into a single `Error` object

### State Management
React's built-in hooks (`useState`, `useEffect`, `useCallback`) are sufficient for this scope. The Dashboard owns all state and passes down only what each child needs. `useCallback` on `fetchExpenses` prevents unnecessary re-fetches when unrelated state changes.

---

## ⚖️ Trade-offs & Intentional Omissions

| Topic                   | Decision & Reason                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------------|
| **Authentication**      | Not implemented — added significantly more infrastructure (JWT, sessions, user model) out of scope |
| **Pagination**          | Not implemented — for real-world use with large datasets, cursor-based pagination would be needed  |
| **Delete / Edit**       | Not implemented — CRUD completeness deferred to keep scope manageable                             |
| **TypeScript**          | Explicitly excluded per spec — JS used throughout                                                  |
| **State library**       | No Redux/Zustand — React hooks sufficient for single-page, single-user scope                       |
| **Testing**             | No unit/integration tests — would add Jest + Supertest for backend, React Testing Library for UI  |
| **Decimal128**          | Used `Number` with rounding instead — simpler for display; acceptable for personal-scale use       |
| **Docker / CI**         | Not included — would add `Dockerfile` + `docker-compose.yml` for production deployment            |

---

## 🔮 Future Improvements

- [ ] **Authentication** — JWT-based login/register, per-user expense isolation
- [ ] **Edit & Delete** — Full CRUD on expenses
- [ ] **Pagination** — Cursor-based infinite scroll or page navigation
- [ ] **Date range filter** — Filter expenses by custom date range (e.g., current month)
- [ ] **CSV / PDF Export** — Download expense reports
- [ ] **Charts** — Monthly trend line chart, pie chart per category (Recharts or Chart.js)
- [ ] **Budget limits** — Set per-category budgets with visual warnings
- [ ] **Testing** — Jest + Supertest for API, React Testing Library for components
- [ ] **Docker** — Containerize both services with `docker-compose`
- [ ] **Deployment** — Railway / Render (backend) + Vercel (frontend)
- [ ] **PWA** — Offline support with service worker

---

## 🛠 Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios  |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB, Mongoose                    |
| Dev Tools  | Nodemon, Morgan                      |

---

## 📄 License

MIT — free to use and modify.
