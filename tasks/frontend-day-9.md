# Frontend Day 9 – Analytics dashboards and instructor views

**Focus:** Build instructor/admin-facing analytics dashboards to visualize enrollments and completion trends using the Analytics Service API.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/04-database.md](../docs/04-database.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 9 implemented (analytics dashboards and instructor views) |
| ⬜ Not started | |
| 🔄 In progress | |

**Started:** February 5, 2026  
**Completed:** February 5, 2026

---

## Checklist

### 1. Analytics routes and access control

- [x] Implement `/analytics` route for instructor/admin roles.
- [x] Ensure the route is protected by role checks in the frontend.

### 2. Data fetching

- [x] Create React Query hooks for fetching analytics data (e.g. enrollments over time, completion rates) from the Analytics Service.
- [x] Support filters like course selection and date range.

### 3. Visualization components

- [x] Implement basic chart or table components to render analytics (you can start with tables if charting library is not chosen yet).
- [x] Show loading and error states clearly.
- [x] Provide empty state messaging when there is no data.

### 4. Instructor UX

- [x] Link from instructor course management pages to relevant analytics views.
- [x] Ensure navigation between analytics and teaching views is clear.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 9 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 9 is complete. Next: [Frontend Day 10](frontend-day-10.md) (Polishing, accessibility, performance, and frontend CI).

