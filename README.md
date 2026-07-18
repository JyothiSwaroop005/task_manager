# Task Manager

A full-stack, real-time task management web application. Users register, log in,
and manage tasks (create / edit / delete / complete) with live search, filtering,
sorting, and a dashboard — all updated instantly across every open tab via Socket.io.

## Overview

- **Frontend:** React 18 (Vite), plain CSS with CSS variables (light/dark theme)
- **Backend:** Node.js, Express.js, REST API secured with JWT
- **Database:** MySQL
- **Real-time:** Socket.io — task changes push to all of the user's connected clients instantly
- **Auth:** JWT + bcrypt password hashing, persistent login via `localStorage`

## Features

- Register / login / logout, persistent sessions, protected routes
- Full task CRUD, mark pending/completed
- Search by title/description, filter by status/priority/due date, sort by latest/oldest/alphabetical/priority/due date
- Dashboard: total/completed/pending/high-priority counts, completion %, progress bar, recent tasks, upcoming deadlines
- Live updates on create/edit/delete/status-change — no refresh needed
- Responsive UI (desktop/tablet/mobile), dark mode toggle
- Profile page, change-password page, initials-based avatar
- Toasts, loading spinners, empty states, 404 page, error boundary

## Tech Stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Frontend  | React (Vite), React Router, Axios, Socket.io-client, react-icons |
| Backend   | Node.js, Express.js, Socket.io, express-validator |
| Database  | MySQL (via `mysql2`)                          |
| Auth      | JWT (`jsonwebtoken`), `bcryptjs`              |
| Security  | Helmet, CORS, input validation, parameterized SQL |

## Folder Structure

```
task-manager/
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI: Sidebar, Navbar, TaskCard, modals, badges...
│       ├── pages/         # Login, Register, Dashboard, Tasks, Profile, ChangePassword, NotFound, ErrorPage
│       ├── hooks/         # useToast, useDebounce, useTaskFilters
│       ├── services/      # api.js, authService.js, taskService.js, socket.js
│       ├── context/       # AuthContext, TaskContext, ThemeContext, ToastContext
│       ├── styles/        # index.css, variables.css
│       └── App.jsx
├── backend/
│   ├── controllers/       # authController.js, taskController.js
│   ├── routes/             # authRoutes.js, taskRoutes.js
│   ├── models/             # userModel.js, taskModel.js (raw SQL via mysql2)
│   ├── middleware/         # authMiddleware, errorMiddleware, validateMiddleware
│   ├── config/              # db.js, env.js
│   ├── socket/               # index.js (JWT-authenticated Socket.io)
│   ├── utils/
│   └── server.js
├── database/
│   └── schema.sql
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone and install dependencies

```bash
cd task-manager/backend && npm install
cd ../frontend && npm install
```

## Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the `task_manager` database with `users` and `tasks` tables.

## Environment Variables

**backend/.env** (copy from `backend/.env.example`):

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

**frontend/.env** (copy from `frontend/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running Backend

```bash
cd backend
npm run dev      # nodemon, auto-reload
# or
npm start
```

Runs on `http://localhost:5000`.

## Running Frontend

```bash
cd frontend
npm run dev
```

Runs on `http://localhost:5173`.

## Deployment

### Frontend → Vercel
1. Push the repo to GitHub.
2. Import the `frontend/` directory as a new Vercel project.
3. Set build command `npm run build`, output directory `dist`.
4. Add environment variables `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your deployed backend.

### Backend → Render
1. Create a new Web Service, root directory `backend/`.
2. Build command `npm install`, start command `npm start`.
3. Add all variables from `backend/.env.example` in Render's environment settings.
4. Set `CLIENT_URL` to your deployed Vercel URL.

### Database → MySQL
Use a managed MySQL instance (PlanetScale, Railway, AWS RDS, or Render's MySQL). Run
`database/schema.sql` against it, then point `DB_HOST` / `DB_USER` / `DB_PASSWORD` /
`DB_NAME` in the backend environment at that instance.

## API Documentation

All endpoints are prefixed with `/api`. Task routes require `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint                | Description            |
|--------|--------------------------|-------------------------|
| POST   | `/auth/register`         | Create account, returns JWT |
| POST   | `/auth/login`             | Log in, returns JWT     |
| POST   | `/auth/logout`             | Logout (client discards token) |
| GET    | `/auth/profile`             | Get current user        |
| PUT    | `/auth/profile`               | Update username/email   |
| PUT    | `/auth/change-password`        | Change password         |

### Tasks
| Method | Endpoint             | Description               |
|--------|------------------------|-----------------------------|
| GET    | `/tasks`                | List current user's tasks   |
| GET    | `/tasks/:id`              | Get one task                 |
| POST   | `/tasks`                    | Create task                   |
| PUT    | `/tasks/:id`                  | Update task                    |
| DELETE | `/tasks/:id`                    | Delete task                     |
| PATCH  | `/tasks/:id/status`                | Update status only               |

Each task mutation also emits a Socket.io event (`task:created`, `task:updated`,
`task:deleted`, `task:statusUpdated`) to the room `user_<id>`, so every open tab for
that user updates live without a refresh.

## Screenshots

_Add screenshots of the Dashboard, Tasks page, and modals here._

## Design Note

Real-time events are scoped per-user (a private Socket.io room per account) rather than
broadcast to every connected client globally, since tasks are private to each user. If
you need a shared/team board instead, broadcast to a shared room in
`backend/socket/index.js` and adjust `req.io.to(...)` calls in `taskController.js`.
