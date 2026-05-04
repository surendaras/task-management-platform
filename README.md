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

## Deploy With Docker

Start Docker Desktop, then run this command from the project root:

```powershell
docker compose up -d --build
```

Open the app:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8080/api`
- MySQL from host: `127.0.0.1:3307`

Stop deployment:

```powershell
docker compose down
```

You can set optional production variables in a `.env` file:

```env
MYSQL_ROOT_PASSWORD=change-this-password
MYSQL_DATABASE=work_force_task_automation
JWT_SECRET=change-this-to-a-long-random-secret-value
APP_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

## Permanent Public Deployment

Use Railway for a permanent public URL. This repository already includes Dockerfiles for both the backend and frontend.

Current Railway deployment:

- Frontend public URL: `https://frontend-production-9cfa.up.railway.app/workspace`
- Backend API URL: `https://backend-production-1183.up.railway.app/api`
- Railway project: `taskflow-management`

1. Push the code to GitHub:

```powershell
git add .
git commit -m "Add deployment setup"
git push origin main
```

2. Create a new project in Railway: https://railway.com

3. Add a MySQL database from `+ New`.

4. Add the backend service:

- Source: GitHub repo `surendaras/task-management-platform`
- Root directory: `backend`
- Dockerfile path: `Dockerfile`
- Variables:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQLUSER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=change-this-to-a-long-random-secret-value
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.up.railway.app
```

Generate a domain for the backend service. Backend URL example:

```text
https://your-backend-domain.up.railway.app
```

5. Add the frontend service:

- Source: same GitHub repo
- Root directory: `frontend`
- Dockerfile path: `Dockerfile`
- Variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

Generate a domain for the frontend service. This will be the permanent public URL for the app:

```text
https://your-frontend-domain.up.railway.app
```

6. After you get the frontend domain, set the same URL in the backend `APP_CORS_ALLOWED_ORIGINS` variable and redeploy the backend.

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
