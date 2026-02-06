# Mobile Day 13 – Global error handling, banners, and empty states on mobile

**Focus:** Provide a consistent, mobile-friendly experience for errors, notifications, and empty states across the app.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Global error and notification patterns being implemented on mobile. |
| ✅ Done | Unified error handling, banners, and empty states across key mobile screens. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 13 is done_

---

## Checklist

### 1. Global error boundary and fallbacks

- [ ] Add a top-level error boundary or fallback component to catch unexpected errors.
- [ ] Show a friendly error screen with a retry button or navigation back to a safe screen.

### 2. Banners, toasts, and inline feedback

- [ ] Implement reusable components for in-app banners and toasts suited to mobile.
- [ ] Standardize success, warning, and error presentations (colors, icons, vibration/haptics if desired).
- [ ] Replace ad-hoc `Alert.alert` calls with the shared primitives where appropriate.

### 3. Loading and empty states

- [ ] Ensure each major data-driven screen (courses, assignments, notifications) has clear loading indicators.
- [ ] Add meaningful empty states (e.g. “No courses yet”) with suggested next actions.
- [ ] Use skeletons or shimmer placeholders sparingly and consistently.

### 4. Error mapping usage

- [ ] Connect `MobileAppError` from Day 11 to UI: show validation errors near inputs and global problems as banners/toasts.
- [ ] Provide mobile-appropriate copy for network offline, timeouts, and auth failures.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 13 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 13 is complete. Next: [Mobile Day 14](mobile-day-14.md) (Deep linking, navigation params, and URL schemes).

