# Frontend Day 8 – Notifications and basic payments UI

**Focus:** Implement in-app notifications UI and a basic payments flow for selecting plans and starting checkout.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 8 implemented (notifications and payments UI) |
| ⬜ Not started | |
| 🔄 In progress | |

**Started:** February 5, 2026  
**Completed:** February 5, 2026

---

## Checklist

### 1. Notifications UI

- [x] Add a notifications entry point in the header (bell icon or similar).
- [x] Implement notifications list view (e.g. `/notifications` or dropdown panel).
- [x] Use React Query to fetch notifications for the current user.
- [x] Implement mutation to mark notifications as read (optimistic update is fine).

### 2. Payments UI

- [x] Implement a page to show available plans (from Payment Service) and pricing.
- [x] Implement a flow to start checkout (e.g. selecting a plan and calling the backend to create a payment/intent).
- [x] Show success/failure states consistent with the mock payment backend.

### 3. UX and safety

- [x] Disable payment buttons while a payment request is in progress.
- [x] Avoid optimistic updates for final payment status; rely on confirmed backend responses or webhooks.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 8 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 8 is complete. Next: [Frontend Day 9](frontend-day-9.md) (Analytics dashboards and instructor views).

