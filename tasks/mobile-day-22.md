# Mobile Day 22 – Push notifications, badges, and in-app inbox

**Focus:** Implement robust push notification handling, app badges, and an in-app notifications inbox.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), platform push docs (FCM/APNs, Expo Notifications, etc.).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | Users reliably receive and manage notifications on mobile. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Permissions and device tokens

- [x] Request push notification permission in a user-friendly way, with pre-permission explanations if needed.
- [x] Obtain and register device tokens with your backend for the authenticated user.

### 2. Handling notifications

- [x] Implement handlers for foreground, background, and cold-start notifications.
- [x] Route users to the relevant screen (course, assignment, announcement) when they tap a notification.

### 3. Badges and in-app inbox

- [x] Support app icon badges or simulated badge counts in-app where supported.
- [x] Implement an in-app notifications screen listing recent notifications with read/unread status.

### 4. Testing and UX

- [ ] Test push flows on both Android and iOS (or at least one real device each, if possible).
- [ ] Ensure notifications respect user preferences and are not overly noisy.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 22 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 22 is complete. Next: [Mobile Day 23](mobile-day-23.md) (In-app purchases / payments UX on mobile).

