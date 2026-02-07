# Frontend Day 29 – Accessibility deep dive (WCAG, keyboard, screen readers)

**Focus:** Go beyond basics and systematically improve accessibility for keyboard users and screen readers.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), public WCAG guidance.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Deep accessibility improvements underway. |
| ✅ Done | Key LMS flows meet strong accessibility standards. |

**Started:** 2026-02-07  
**Completed:** _fill when Frontend Day 29 is done_

---

## Checklist

### 1. Keyboard navigation

- [ ] Audit major flows (login, course catalog, course view, assignments, analytics) for full keyboard operability.
- [ ] Ensure visible focus states are clear and consistent for all interactive elements.
- [ ] Fix any keyboard traps or unreachable controls.

### 2. Semantics and landmarks

- [ ] Use appropriate semantic HTML elements (headings, lists, buttons vs. links).
- [ ] Add ARIA landmarks and roles where necessary (nav, main, banner, complementary).

### 3. Screen reader experience

- [ ] Provide meaningful labels, alt text, and aria attributes for key components (forms, modals, toasts, tabs).
- [ ] Test a few flows using a screen reader and fix major issues discovered.

### 4. Color and contrast

- [ ] Verify color contrast ratios meet WCAG AA for text and important UI elements.
- [ ] Adjust theme tokens or component styles where contrast is insufficient.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 29 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 29 is complete. Next: [Frontend Day 30](frontend-day-30.md) (Frontend documentation, storybook, and onboarding).

