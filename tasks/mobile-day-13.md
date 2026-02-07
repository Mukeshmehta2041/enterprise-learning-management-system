# Mobile Day 13 – Global error handling, banners, and empty states on mobile

**Focus:** Provide a consistent, mobile-friendly experience for errors, notifications, and empty states across the app.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Unified error handling, banners, and empty states across key mobile screens. |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Global error boundary and fallbacks

- [x] Add a top-level error boundary component to catch unexpected layout/render errors.
- [x] Show a friendly error screen with a reset button.

### 2. Banners, toasts, and inline feedback

- [x] Implement reusable `Banner` component suited for mobile notifications.
- [x] Created `useNotificationStore` for global notification management.
- [x] Use banners for feedback (success/error) instead of ad-hoc alerts where appropriate.

### 3. Loading and empty states

- [x] Ensure major data-driven screens have consistent loading indicators.
- [x] Created reusable `EmptyState` component for lists and search results.
- [x] Added meaningful empty states to Courses and Dashboard screens.

### 4. Error mapping usage

- [x] Map `MobileAppError` messages directly to Banner notifications for consistent user feedback.
- [x] Provide appropriate feedback for network and validation failures.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Mobile Day 13 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 13 is complete. Next: [Mobile Day 14](mobile-day-14.md) (Deep linking, navigation params, and URL schemes).

