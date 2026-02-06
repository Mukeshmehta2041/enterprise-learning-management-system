# Frontend Day 11 – Frontend API contracts, types, and error modeling

**Focus:** Align the frontend strictly with backend API contracts using typed clients, shared models (where possible), and consistent error structures.

**References:** [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/api-specs/](../docs/api-specs/), [tasks/day-11.md](day-11.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Frontend API contracts and error modeling being implemented. |
| ✅ Done | Frontend API contracts, typings, and error handling aligned with backend specs. |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 11 is done_

---

## Checklist

### 1. Type-safe API client contracts

- [ ] Review backend OpenAPI specs for User, Auth, Course, Enrollment, and Analytics services.
- [ ] Generate or hand-write TypeScript types for key request/response models (User, Course, Enrollment, Auth tokens, Analytics summaries).
- [ ] Ensure the frontend API client uses these types end-to-end (React Query hooks, components, and forms).

### 2. Error modeling

- [ ] Define a normalized error shape in the frontend (e.g. `AppError` with `code`, `message`, optional `fieldErrors`).
- [ ] Map backend error responses (validation errors, 4xx, 5xx) into this common error shape.
- [ ] Update existing API hooks to throw or return typed errors instead of `any`.

### 3. Contract validation and guards

- [ ] Add runtime guards (e.g. `zod` or similar) for critical responses where backend changes could break the UI.
- [ ] Log or surface a clear error if the response shape drifts from expectations.
- [ ] Add at least one test that fails if the API contract changes in a breaking way (snapshot or schema-based).

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 11 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 11 is complete. Next: [Frontend Day 12](frontend-day-12.md) (Frontend integration tests and API mocking).

