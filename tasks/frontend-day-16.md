# Frontend Day 16 – Role-based UI and permissions guards

**Focus:** Enforce role-based access in the UI so learners, instructors, and admins only see and can trigger actions they’re allowed to perform.

**References:** [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md), [docs/07-security.md](../docs/07-security.md), [tasks/day-16.md](day-16.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Role-based UI and guards being implemented. |
| ✅ Done | UI consistently reflects permissions for all major roles. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 16 is done_

---

## Checklist

### 1. Role and permissions model in the frontend

- [ ] Confirm the roles and permissions exposed by the backend (e.g. `LEARNER`, `INSTRUCTOR`, `ADMIN`, support roles).
- [ ] Extend the auth/session context to include role/permission info in a typed way.
- [ ] Add helper functions/hooks (e.g. `useHasRole`, `useCan(action, resource)`) to centralize permission checks.

### 2. Route-level guards

- [ ] Protect instructor/admin routes using role checks at the router/layout level (not just inside pages).
- [ ] Ensure unauthorized users are redirected to a meaningful page (e.g. learner dashboard or “not authorized” screen).
- [ ] Add tests to verify that direct navigation to protected routes respects role-based access.

### 3. Component-level visibility

- [ ] Hide or disable buttons and menu items the current user cannot use (e.g. “Create course” for learners).
- [ ] Add subtle explanatory copy or tooltips when actions are disabled due to permissions.
- [ ] Review key screens (courses, enrollments, analytics, admin tools) to ensure no sensitive actions are exposed.

### 4. Staging and UAT scenarios

- [ ] Add simple ways (test users or feature flags) to quickly log in as different roles in staging/UAT to verify UX.
- [ ] Document how QA can verify role-based behavior across the app.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 16 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 16 is complete. Next: [Frontend Day 17](frontend-day-17.md) (Complex forms, validation, and wizards).

