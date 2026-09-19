# TaskFlow — React Frontend

A React + TypeScript + Tailwind CSS frontend for the existing Django REST Framework Task Manager API.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- React Router
- Axios
- react-hot-toast

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your Django API root
npm run dev
```

The app expects the DRF backend to be running and reachable at `VITE_API_BASE_URL` (defaults to `http://localhost:8000/api`). Make sure CORS is enabled on the backend for the Vite dev origin (`http://localhost:5173`).

## Project structure

```
src/
├── api/           # one module per resource (axios.ts, auth.ts, tasks.ts, projects.ts, users.ts)
├── lib/           # tokenStore.ts — localStorage-backed JWT storage
├── components/
│   ├── ui/        # Modal, ConfirmDialog, Spinner, EmptyState, ErrorState, Badge, Pagination
│   ├── layout/    # AppShell, Sidebar, Topbar, icons
│   ├── tasks/     # TaskFilters, TaskFormModal, TaskTable
│   └── projects/  # ProjectCard
├── pages/         # Login, Dashboard, Tasks, TaskDetails, Projects, Profile
├── hooks/         # useDebounce
├── context/       # AuthContext
├── routes/        # ProtectedRoute
└── types/         # shared TypeScript types matching the API shape from the spec
```

## Auth

- `POST /token/` and `POST /token/refresh/` are used exactly as documented.
- The access token is attached to every request via an Axios request interceptor.
- On a 401, the response interceptor transparently refreshes the access token once and retries the original request. If the refresh itself fails, the user is signed out and redirected to `/login`.
- On a 429 (the backend throttles at 5 requests/minute), API calls reject with a `ThrottledError` and the UI shows a "you're doing that too often" message instead of a generic failure.

## Assumptions that need confirming against your Swagger/OpenAPI schema

The spec you gave me fully documents `/api/tasks/` and `/api/token/`, but three things the UI needs weren't specified, so I built them against the most likely DRF-router shape and flagged them here rather than guessing silently:

1. **`/api/projects/`** — used for the Projects page, the task-creation project dropdown, and the dashboard. I assumed a standard `ModelViewSet` list endpoint returning either a paginated `{count, next, previous, results}` shape or a plain array (the code handles both), with each project's `owner` nested like `{id, username}`.
2. **`/api/profile/`** — used for the Profile page. I assumed it returns `{username, bio, phone_number}` for the current authenticated user (e.g. a `retrieve`-only view with no `pk`, or `/api/profile/me/`). Update the path in `src/api/users.ts` if yours differs.
3. **`/api/users/`** — used to populate the "assigned users" checklist in the task form. I assumed it returns a list (or paginated list) of `{id, username}`.

If any of these differ — different URL, different pagination, different field names — update the corresponding file in `src/api/` and the matching type in `src/types/index.ts`; nothing else in the app needs to change since API calls are isolated from the UI components.

## Dashboard stats — a note on the throttle

The spec's Task model has no "status" field, and there's no dedicated stats endpoint documented, so "Active Tasks" / "Completed Tasks" on the dashboard are computed as *tasks belonging to an active/completed project* (via each task's `project.id` cross-referenced against `/api/projects/`). Estimated/actual hour totals are summed by walking the paginated `/api/tasks/` results via their `next` links (capped at 15 pages to avoid tripping the 5-requests/minute throttle on large datasets). If you'd rather have exact semantics here, the cleanest fix is a small backend aggregation endpoint (e.g. `/api/tasks/summary/`) — happy to wire the frontend up to it once it exists.

## Build

```bash
npm run build
```
