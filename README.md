# ✅ TaskFlow — Full-Stack Task & Project Management System

> A SaaS-style task management platform with a Django REST API backend and a React + TypeScript frontend — built around real-world API concerns like throttling, permission-scoped querysets, and combinable filter/search/sort/pagination.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](#)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-A30000?style=for-the-badge&logo=django&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](#)

<!--
  🔴 ADD A DEMO GIF OR SCREENSHOT HERE — highest-impact addition you can make.
  Show: dashboard → task list with filters → create/edit task → validation error handling
-->

**[🚀 Live Demo](#)** · **[📘 API Docs (Swagger)](#)**

---

## Overview

TaskFlow is a full-stack task and project management system: a Django REST Framework API backend paired with a React + TypeScript frontend, built to look and behave like a real SaaS product rather than a CRUD tutorial. Users authenticate via JWT, manage projects and tasks scoped to their own assignments, and work through a dashboard with search, filtering, sorting, and pagination — all backed by an API that enforces permissions, validation, and rate limits server-side.

## Key Engineering Highlights

- **Security-Correct by Design** — the frontend never relies on hiding UI elements for authorization; every permission check (`IsAuthenticated`, custom `IsTaskAssignee`) is enforced server-side, with the frontend simply reflecting backend state
- **Object-Level Validation Handling** — surfaces backend validation rules (e.g. `actual_hours <= estimated_hours`, minimum title length) as clear, field-level form errors rather than generic failure messages
- **Composable Query Building** — a UI layer that lets users combine search, min/max filtering, and ordering (`?search=django&min_hours=3&ordering=-estimated_hours`) without ever hand-constructing a URL
- **Resilient to Real API Constraints** — gracefully handles DRF pagination (`PageNumberPagination`) and throttling (HTTP 429 on rate-limit breach), rather than assuming a happy-path API
- **Clean Separation of Concerns** — API logic (`/api`) is fully decoupled from UI components (`/components`, `/pages`), so the backend contract can evolve without a full frontend rewrite
- **JWT-Based Auth Flow** — access/refresh token handling with automatic redirect to login on session expiry

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, React Router, Axios |
| **Backend** | Django 6.1, Django REST Framework |
| **Auth** | JWT (access + refresh token pair) |
| **Database** | PostgreSQL |
| **API Features** | DRF ViewSets & Routers, django-filter, Search, Ordering, Throttling, Pagination |
| **API Docs** | OpenAPI / Swagger |
| **Testing** | DRF `APITestCase` |

## System Architecture

The frontend consumes an existing, already-implemented DRF API — it was built by inspecting real API behavior, not by inventing an ideal contract:

```
┌────────────────────────────────────────────┐
│              React + TypeScript UI           │
│  api/  →  Axios clients (auth, tasks,        │
│           projects, users)                   │
│  components/, pages/, hooks/, context/       │
└────────────────────┬─────────────────────────┘
                      │  REST (JWT Bearer token)
┌────────────────────▼─────────────────────────┐
│           Django REST Framework API           │
│  ModelViewSets · Routers · django-filter      │
│  Permissions (IsAuthenticated, IsTaskAssignee)│
│  Throttling (5 req/min) · Pagination          │
└────────────────────┬─────────────────────────┘
                      │
              ┌───────▼────────┐
              │  PostgreSQL     │
              │  Project · Task │
              │  Profile        │
              └─────────────────┘
```

**Frontend structure:**

```
src/
├── api/          # Axios clients — auth, tasks, projects, users
├── components/   # ui/, layout/, tasks/, projects/
├── pages/        # Login, Dashboard, Tasks, TaskDetails, Projects, Profile
├── hooks/
├── context/
├── types/
└── routes/
```

## Data Model

```
User ──< Project (owner)
User ──< Profile (1:1)
Project ──< Task
User >──< Task (assigned_to, many-to-many)
```

Tasks carry `estimated_hours` and `actual_hours`, with an object-level validation rule ensuring actuals never exceed estimates — enforced server-side and surfaced client-side as a clear form error.

## Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Login, token refresh, and automatic redirect on session expiry |
| **Dashboard** | At-a-glance totals — tasks, active/completed counts, projects, estimated vs. actual hours |
| **Task Management** | Full CRUD with title/description/project/assignee/hours fields and inline validation |
| **Search, Filter & Sort** | Combinable query building (search by keyword, filter by hour range, sort by any supported field) |
| **Pagination** | Page-based navigation matching the backend's `PageNumberPagination` response shape |
| **Project Management** | View and manage projects with status (Active / Completed / Archived), owner, and timestamps |
| **Profile** | View authenticated user's bio and contact info |
| **Resilient UX** | Loading, empty, and error states throughout; toast notifications; confirmation prompts before destructive actions |

## API Reference

Base endpoint: `/api/tasks/` (DRF `ModelViewSet` + router). Full contract documented via Swagger.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/token/` | Obtain access + refresh JWT |
| `POST` | `/api/token/refresh/` | Refresh access token |
| `GET` | `/api/tasks/` | List tasks (scoped to assigned user) |
| `POST` | `/api/tasks/` | Create task |
| `GET` | `/api/tasks/{id}/` | Task detail |
| `PATCH` | `/api/tasks/{id}/` | Partial update |
| `DELETE` | `/api/tasks/{id}/` | Delete task |

**Supported query parameters:**
```
?search=django
?min_hours=3&max_hours=8
?ordering=-estimated_hours
?project=1
```

*(All parameters are combinable, e.g. `?search=django&min_hours=3&ordering=-estimated_hours`.)*

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL

### Backend
The Django backend is already implemented and out of scope for this repo's setup — see the backend project for its own installation steps.

### Frontend Setup
```bash
git clone https://github.com/MHuzaifaAlam/TaskFlow-Frontend.git
cd TaskFlow-Frontend
npm install
npm run dev
```

Configure the API base URL in `src/api/axios.ts` to point at your running Django backend.

## Roadmap

- [ ] Role-based dashboards (manager vs. contributor views)
- [ ] Real-time task updates (WebSockets)
- [ ] Bulk task actions
- [ ] Dark mode

## Author

**Muhammad Huzaifa Alam**
Full-Stack Software Engineer · React.js, Django, FastAPI

[GitHub](https://github.com/MHuzaifaAlam) · [LinkedIn](https://www.linkedin.com/in/m-huzaifa-alam/) · [Portfolio](https://huzaifa-at-work.framer.website/) · [Email](mailto:mhuzaifaalam7@gmail.com)

---

<p align="center"><i>Frontend built against an existing production DRF API — inspected via Swagger/OpenAPI rather than assumed.</i></p>
