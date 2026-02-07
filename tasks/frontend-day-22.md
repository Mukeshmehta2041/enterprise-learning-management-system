# Frontend Day 22 – Notifications center and in-app messaging

**Focus:** Provide a central place for users to review notifications and, where supported, in-app messages.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Users can reliably see and manage their in-app notifications. |

**Started:** February 6, 2026  
**Completed:** February 6, 2026

---

## Checklist

### 1. Notifications center UI

- [x] Add a notifications icon/badge in the app header with unread count.
- [x] Implement a notifications center page or panel listing recent notifications (e.g. enrollments, assignments, announcements).
- [x] Include filtering or grouping where helpful (e.g. by course or type).

### 2. In-app toasts and inline alerts

- [x] Ensure important system events (e.g. enrollment success, assignment graded) surface as in-app toasts or banners.
- [x] Make toasts consistent with your global notification patterns from earlier days.

### 3. Read/unread and lifecycle

- [x] Support read/unread states for notifications; allow users to mark all as read.
- [x] Wire up backend APIs or event streams as available; fall back to polling if needed.

### 4. Tests and UX

- [x] Add tests to verify notification fetching, read/unread toggling, and badge counts.
- [x] Do a manual UX pass to ensure notifications are timely but not overwhelming.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 22 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 22 is complete. Next: [Frontend Day 23](frontend-day-23.md) (Payments UX, invoices, and billing history).

