## DecodeLabs Task Mapping

This repository contains a complete full-stack Attendance Management System built as part of the DecodeLabs Full Stack Development tasks.

### Task 1 - Responsive Frontend Interface
- React + Vite frontend
- Responsive UI using Tailwind CSS
- Role-based dashboards for Admin, Faculty, and Student
- Forms, tables, reports, and clean user interface

### Task 2 - Backend API Development
- Node.js and Express.js backend
- REST API endpoints for authentication, students, faculty, sections, subjects, attendance, reports, and notifications
- Request handling, validation, and error responses

### Task 3 - Database Integration
- MongoDB database integrated using Prisma
- CRUD operations for students, faculty, sections, subjects, attendance, reports, and notifications
- Schema design with relations and unique constraints

### Task 4 - Frontend & Backend Integration
- React frontend connected with Express backend APIs
- Dynamic data rendering from database
- JWT-based authentication flow
- Full attendance management workflow from UI to database


# AttendEase

AttendEase is a production-ready MVP for college attendance management with Admin, Faculty, and Student roles.

## Stack

- React 18, Vite, Tailwind CSS
- Node.js, Express
- MongoDB with Prisma
- JWT authentication and bcrypt password hashing
- Excel and PDF report exports
- SendGrid-ready notification service
- Docker support

## Local Setup

1. Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

2. Configure environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set `DATABASE_URL` in `server/.env`. Prisma's MongoDB connector requires MongoDB to run as a replica set for writes. For the Docker MongoDB service in this repo:

```env
DATABASE_URL="mongodb://localhost:27017/attendease?replicaSet=rs0&directConnection=true"
```

Start the local MongoDB replica set with:

```bash
docker compose up -d mongo mongo-init
```

3. Generate Prisma client and sync the MongoDB schema:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

Prisma MongoDB does not use SQL-style migration files. In this project `npm run prisma:migrate` is an alias for `prisma db push`, which creates the required collections and indexes from `server/prisma/schema.prisma`.

4. Seed the database:

```bash
npm run seed
```

Seeded accounts:

- Admin: `admin@attendease.local` / `Admin@123`
- Faculty: `faculty1@attendease.local` / `Faculty@123`
- Student: `student1@attendease.local` / `Student@123`

5. Run the API:

```bash
cd server
npm run dev
```

6. Run the client:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Docker

Create `server/.env` from the example, then run:

```bash
docker compose up --build
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000/api`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/students`
- `POST /api/students/bulk-import` with multipart CSV field `file`; columns: `email,password,rollNo,name,sectionId,semester,photoUrl`
- `GET/POST/PUT/DELETE /api/faculty`
- `GET/POST/PUT/DELETE /api/sections`
- `GET/POST/PUT/DELETE /api/subjects`
- `GET/POST/PUT /api/attendance`
- `GET /api/reports`
- `GET /api/reports/export/excel`
- `GET /api/reports/export/pdf`
- `GET /api/notifications`
- `GET /api/dashboard/admin`
- `GET /api/dashboard/faculty`
- `GET /api/dashboard/student`

## Notes

- Attendance values: Present = `1`, Absent = `0`, Late = `0.5` by default.
- Duplicate attendance for the same student, subject, and date is blocked with a Prisma compound unique index.
- Faculty can update attendance only on the same calendar day.
- Admin corrections require a reason and are logged in `AttendanceCorrection` and `AuditLog`.
- SendGrid is configurable with `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and `ENABLE_EMAIL_NOTIFICATIONS`.
