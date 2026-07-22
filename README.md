# Employee Leave Management System

A full-stack Leave Management System where employees can apply for leave and
managers can approve or reject leave requests.

**Tech Stack:** React (Vite) + Django REST Framework + Simple JWT + PostgreSQL

## Project Structure

```
leave-management-system/
├── backend/     # Django REST API
└── frontend/    # React (Vite) app
```

## Quick Start

1. **Backend** — see [`backend/README.md`](backend/README.md)
   ```bash
   cd backend
   python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
<<<<<<< HEAD
   ```

3. Create a PostgreSQL database
   ```sql
   CREATE DATABASE leave_management_db;
   ```

4. `.env`   fill in your own values
   ```bash
   cp .env.example .env
   ```

5. Run migrations
   ```bash
=======
   cp .env.example .env      # then edit with your DB credentials
>>>>>>> 66b22bb (Project is in fully working condition)
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

2. **Frontend** — see [`frontend/README.md`](frontend/README.md)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. Go to `http://localhost:8000/admin/` and create at least one user with
   role `EMPLOYEE` and one with role `MANAGER`.

4. Open `http://localhost:5173`, log in, and try applying for / approving leave.

## Features Implemented

| Feature | Status |
|---|---|
| JWT Authentication (login + refresh) | ✅ |
| Custom User model with Employee/Manager roles | ✅ |
| Role-based redirects & role-based navbar | ✅ |
| Protected Routes (frontend) & custom permissions (backend) | ✅ |
| Apply Leave (with validation) | ✅ |
| Leave History (with cancel for pending) | ✅ |
| Manager: view / approve / reject leave requests | ✅ |
| Leave rules: no past dates, end ≥ start, max 20 annual days, no overlap | ✅ |
| Employee & Manager dashboards | ✅ |
| Pagination, Search, Status filtering | ✅ |
| Loading states & error handling | ✅ |
| Responsive UI (Bootstrap 5) | ✅ |

## API Overview

See [`backend/README.md`](backend/README.md) for the full endpoint list.

## Notes for Submission

- A **Postman collection** and the **PostgreSQL schema** should be exported
  once you've run migrations locally (`python manage.py sqlmigrate ...` or a
  `pg_dump --schema-only` of `leave_management_db`), since these depend on a
  live database this environment doesn't have network access to run.
- Bonus items (Docker, Swagger, unit tests, email notifications on console)
  are not yet included — happy to add any of these next if useful.
