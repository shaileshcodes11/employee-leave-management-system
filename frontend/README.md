# Employee Leave Management System - Frontend

React (Vite) + React Router DOM + Axios + Bootstrap 5

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and point it at your backend
   ```bash
   cp .env.example .env
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

> Make sure the Django backend is running at `http://localhost:8000` (or update
> `VITE_API_BASE_URL` in `.env` to match your backend URL) and that
> `CORS_ALLOWED_ORIGIN` in the backend's `.env` matches this frontend's URL.

## Folder Structure

```
src/
├── api/
│   └── axios.js          # Axios instance + JWT interceptor + auto refresh
├── context/
│   └── AuthContext.jsx   # Auth state, login/logout, role helpers
├── components/
│   ├── Layout.jsx         # Navbar + content + sticky footer
│   ├── Navbar.jsx         # Role-based navigation
│   ├── Footer.jsx
│   ├── DashboardCard.jsx  # Reusable stat card
│   └── ProtectedRoute.jsx # Auth + role guard for routes
├── pages/
│   ├── Login.jsx
│   ├── EmployeeDashboard.jsx
│   ├── ApplyLeave.jsx
│   ├── LeaveHistory.jsx
│   ├── ManagerDashboard.jsx
│   └── LeaveRequests.jsx
├── App.jsx                # Routes
└── main.jsx                # Entry point
```

## Login Credentials

Create Employee and Manager users from the Django admin (`/admin/`) on the
backend, then log in with those credentials here. The app automatically
redirects to the correct dashboard based on the user's role.
