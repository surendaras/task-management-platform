# TaskFlow

Java full stack Jira-style task management project with:

- Home page
- Login and create account
- Sidebar after login
- Dashboard with progress, users, tasks, status breakdown, chart and graph
- Add task with priority, status and assignee
- Add user
- Total task list

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Data JPA, MySQL, JWT
- Frontend: React, Vite, Recharts

## MySQL Database

Run this SQL:

```sql
CREATE DATABASE work_force_task_automation;
```

Configured credentials:

- Username: `root`
- Password: `1234`

## Default Login

- Email: `admin@taskflow.local`
- Password: `admin123`

## Run Backend

```powershell
cd backend
mvn spring-boot:run
```

Backend runs on `http://127.0.0.1:8080`

## Run Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1
```

Frontend runs on `http://127.0.0.1:5173`

## Run Both Together

```powershell
powershell -ExecutionPolicy Bypass -File .\run-all.ps1
```

Stop both:

```powershell
.\stop-all.ps1
```

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/users`
- `POST /api/users`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`
