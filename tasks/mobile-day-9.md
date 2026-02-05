# Mobile Day 9 – Notifications and basic payments on mobile

**Focus:** Implement in-app notifications UI and a simple payments experience for selecting plans and starting checkout on mobile.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 9 implemented (notifications and basic payments on mobile) |

**Started:** Mobile Day 9  
**Completed:** -

---

## Checklist

### 1. Notifications UI

- [ ] Add a notifications entry point (icon in header or dedicated screen).
- [ ] Implement notifications list with unread/read states.
- [ ] Use React Query to fetch notifications for the current user.
- [ ] Implement a mutation to mark notifications as read (optimistic update is acceptable).

### 2. Payments UI

- [ ] Implement a simple plans screen listing available payment plans.
- [ ] Implement a flow to start checkout (e.g. call Payment Service to create a payment/intent).
- [ ] Decide whether to hand off to web/payment view (e.g. in-app browser) or display basic status in-app based on backend behavior.

### 3. Safety and UX

- [ ] Disable payment buttons while a payment request is in progress.
- [ ] Do not treat payments as successful until confirmed by the backend.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 9 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 9 is complete. Next: [Mobile Day 10](mobile-day-10.md) (Mobile polishing, performance, and release basics).

