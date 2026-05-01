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

Docker Desktop start karke project root se run karein:

```powershell
docker compose up -d --build
```

App open karein:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8080/api`
- MySQL from host: `127.0.0.1:3307`

Stop deployment:

```powershell
docker compose down
```

Optional production variables `.env` file me set kar sakte hain:

```env
MYSQL_ROOT_PASSWORD=change-this-password
MYSQL_DATABASE=work_force_task_automation
JWT_SECRET=change-this-to-a-long-random-secret-value
APP_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

## Permanent Public Deployment

Permanent public URL ke liye Railway use karein. Is repo me backend aur frontend ke Dockerfiles ready hain.

1. Code GitHub par push karein:

```powershell
git add .
git commit -m "Add deployment setup"
git push origin main
```

2. Railway me new project banayein: https://railway.com

3. `+ New` se MySQL database add karein.

4. Backend service add karein:

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

Generate Domain on backend service. Backend URL example:

```text
https://your-backend-domain.up.railway.app
```

5. Frontend service add karein:

- Source: same GitHub repo
- Root directory: `frontend`
- Dockerfile path: `Dockerfile`
- Variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

Generate Domain on frontend service. Yehi app ka permanent public URL hoga:

```text
https://your-frontend-domain.up.railway.app
```

6. Frontend domain milne ke baad backend ke `APP_CORS_ALLOWED_ORIGINS` me wahi frontend URL set karke backend redeploy karein.

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
