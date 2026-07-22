# Employee Leave Management System - Backend

Django + Django REST Framework + Simple JWT + PostgreSQL

## Setup

1. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Create a PostgreSQL database
   ```sql
   CREATE DATABASE leave_management_db;
   ```

4. Copy `.env.example` to `.env` and fill in your own values
   ```bash
   cp .env.example .env
   ```

5. Run migrations
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser (to access /admin/ and create the first users)
   ```bash
   python manage.py createsuperuser
   ```

7. Create Employee and Manager users
   - Go to `http://localhost:8000/admin/`
   - Add users and set their **role** field to `EMPLOYEE` or `MANAGER`

8. Run the development server
   ```bash
   python manage.py runserver
   ```

   API will be available at `http://localhost:8000/api/`

## API Endpoints

| Method | Endpoint                              | Description                     |
|--------|----------------------------------------|----------------------------------|
| POST   | /api/token/                            | Login, returns JWT tokens + user |
| POST   | /api/token/refresh/                    | Refresh access token             |
| GET    | /api/accounts/profile/                 | Logged-in user's profile         |
| GET    | /api/leaves/                           | List my leave requests           |
| POST   | /api/leaves/                           | Apply for leave                  |
| GET    | /api/leaves/{id}/                      | Retrieve a leave request         |
| PATCH  | /api/leaves/{id}/cancel/               | Cancel a pending leave           |
| GET    | /api/leaves/manager/                   | List all leave requests (manager)|
| PATCH  | /api/leaves/manager/{id}/approve/      | Approve a leave request          |
| PATCH  | /api/leaves/manager/{id}/reject/       | Reject a leave request           |
| GET    | /api/dashboard/employee/               | Employee dashboard stats         |
| GET    | /api/dashboard/manager/                | Manager dashboard stats          |

Both leave list endpoints support:
- `?status=PENDING/APPROVED/REJECTED` (filter)
- `?search=<text>` (search by reason / employee name)
- `?page=<n>` (pagination, 10 per page)

## Leave Rules

- Cannot apply for past dates
- End date cannot be before start date
- Maximum 20 annual leave days
- No overlapping approved leave
