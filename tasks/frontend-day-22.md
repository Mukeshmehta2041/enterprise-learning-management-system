# Frontend Day 22 – Notifications center and in-app messaging

**Focus:** Provide a central place for users to review notifications and, where supported, in-app messages.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Notifications center and in-app messaging being implemented. |
| ✅ Done | Users can reliably see and manage their in-app notifications. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 22 is done_

---

## Checklist

### 1. Notifications center UI

- [ ] Add a notifications icon/badge in the app header with unread count.
- [ ] Implement a notifications center page or panel listing recent notifications (e.g. enrollments, assignments, announcements).
- [ ] Include filtering or grouping where helpful (e.g. by course or type).

### 2. In-app toasts and inline alerts

- [ ] Ensure important system events (e.g. enrollment success, assignment graded) surface as in-app toasts or banners.
- [ ] Make toasts consistent with your global notification patterns from earlier days.

### 3. Read/unread and lifecycle

- [ ] Support read/unread states for notifications; allow users to mark all as read.
- [ ] Wire up backend APIs or event streams as available; fall back to polling if needed.

### 4. Tests and UX

- [ ] Add tests to verify notification fetching, read/unread toggling, and badge counts.
- [ ] Do a manual UX pass to ensure notifications are timely but not overwhelming.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 22 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 22 is complete. Next: [Frontend Day 23](frontend-day-23.md) (Payments UX, invoices, and billing history).

