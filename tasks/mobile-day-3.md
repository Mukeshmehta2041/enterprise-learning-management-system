# Mobile Day 3 – Design system primitives

**Focus:** Implement shared UI primitives and theming for the mobile app, aligned with the web design system.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 3 implemented (mobile design system primitives and theming) |

**Started:** Mobile Day 3  
**Completed:** -

---

## Checklist

### 1. Theme setup

- [ ] Define a theme object (colors, spacing, typography, radius, shadows) matching your LMS branding.
- [ ] Implement a simple theme provider or hook to access theme values across components.
- [ ] Respect system light/dark mode (e.g. using `useColorScheme`) and map theme tokens accordingly.

### 2. Shared primitives

- [ ] Create `AppText` component that wraps `Text` with theme-based styles.
- [ ] Create `Button` component with primary/secondary/outline variants and loading/disabled states.
- [ ] Create `Input` component with label, helper text, and error state.
- [ ] Create `Card` and `ListItem` components for reusable layouts.

### 3. Accessibility

- [ ] Ensure touch targets are large enough and provide clear press feedback.
- [ ] Add basic accessibility labels/roles for buttons and important components.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 3 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 3 is complete. Next: [Mobile Day 4](mobile-day-4.md) (Auth flows on mobile).

