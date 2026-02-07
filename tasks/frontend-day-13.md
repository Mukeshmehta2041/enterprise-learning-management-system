# Frontend Day 13 – Global error handling, toasts, and empty states

**Focus:** Provide a consistent, user-friendly experience for errors, notifications, and empty states across the LMS.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Unified error handling, toasts, and empty states across key screens. |

**Started:** 2026-02-06
**Completed:** 2026-02-06

---

## Checklist

### 1. Global error boundary and fallbacks

- [x] Add a top-level React error boundary for catastrophic UI errors, with a friendly fallback screen.
- [x] Provide a way for users to retry or navigate back to safety from the error screen.

### 2. Toasts and inline feedback

- [x] Implement a toast/notification system consistent with the design system.
- [x] Standardize success, warning, and error styles (icons, colors, copy).
- [x] Replace ad-hoc `alert` or inline messages with the shared toast/notification primitives where appropriate.

### 3. Loading and empty states

- [x] Ensure every major data-driven screen has clear loading indicators.
- [x] Add meaningful empty states (e.g. “No courses yet”, “No enrollments”) with helpful next steps.
- [x] Make sure skeleton loaders or placeholders fit the LMS visual style.

### 4. Error mapping

- [x] Connect the error modeling from Day 11 to UI: surface validation errors near form fields; show global errors using toasts.
- [x] Add standardized error messages for common scenarios (network offline, unauthorized, rate-limited).

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 13 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 13 is complete. Next: [Frontend Day 14](frontend-day-14.md) (Advanced routing, nested layouts, and URL state).

