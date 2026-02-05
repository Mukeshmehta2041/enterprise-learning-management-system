# Frontend Day 3 – Auth screens and session management

**Focus:** Implement login/register/logout UI, connect to backend Auth/User APIs, and manage session state in the frontend.

**References:** [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/frontend/05-auth-and-security.md](../docs/frontend/05-auth-and-security.md), [docs/07-security.md](../docs/07-security.md), [docs/api-specs/auth-service-api.md](../docs/api-specs/auth-service-api.md), [docs/api-specs/user-service-api.md](../docs/api-specs/user-service-api.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 3 implemented (auth flows and session management working) |

**Started:** 2026-02-05
**Completed:** 2026-02-05

---

## Checklist

### 1. API client and React Query setup

- [x] Implement base API client (e.g. `src/shared/api/client.ts`) with `VITE_API_BASE_URL` and optional auth header.
- [x] Set up `QueryClient` and React Query provider at the app root.

### 2. Auth UI screens

- [x] Build `/login` page: email/password form, validation, error messages.
- [x] Build `/register` page: registration form aligned with User Service API.
- [x] Ensure both screens use shared form components (from Day 2).

### 3. Auth mutations and session store

- [x] Implement React Query mutations for login (`/api/v1/auth/token`) and register (`/api/v1/users`).
- [x] Create an `AuthContext` or global store to hold `accessToken`, `user`, and `roles`.
- [x] After login, fetch current user (`/api/v1/auth/me` or `/api/v1/users/me`) and populate session state.

### 4. Logout and route guards

- [x] Implement logout flow: call `/api/v1/auth/logout`, clear local session, navigate to `/login`.
- [x] Implement route guard logic for private routes: if not authenticated, redirect to `/login`.
- [ ] Optionally, implement role-based guards for instructor/admin routes (can be refined later).

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 3 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 3 is complete. Next: [Frontend Day 4](frontend-day-4.md) (Course catalog listing & filtering).

