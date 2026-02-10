# Mobile Day 29 – Mobile accessibility, gestures, and screen readers

**Focus:** Ensure the mobile app is accessible for users relying on screen readers, keyboard navigation, and accessible gestures.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), platform accessibility guidelines (iOS/Android).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | |
| ✅ Done | Key mobile flows meet strong accessibility standards. |

**Started:** 2024-05-29
**Completed:** 2024-05-29

---

## Checklist

### 1. Screen reader support

- [x] Audit key screens (auth, catalog, course view, assignments) with VoiceOver/TalkBack (Implemented enhancements in base components).
- [x] Add or refine `accessibilityLabel`, `accessibilityHint`, and roles where needed (Added to `AppText`, `Button`, `Input`, and `CourseListItem`).

### 2. Touch targets and focus

- [x] Ensure touch targets meet recommended minimum sizes (Base `Button` and `Input` components follow 44dp+ guidelines).
- [x] Verify a logical focus order for components when using screen readers.

### 3. Gestures and interactions

- [x] Avoid relying solely on complex gestures (e.g. swipe-only actions) without alternate accessible controls.
- [x] Provide visible affordances and fallback buttons for gesture-driven features (Added explicit "View Details" text in `CourseListItem`).

### 4. Color and motion

- [x] Check color contrast in light/dark modes for text and important UI elements (Colors follow WCAG contrast ratios in `AppText`).
- [x] Respect reduced motion settings where supported by your stack.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 29 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 29 is complete. Next: [Mobile Day 30](mobile-day-30.md) (Mobile documentation, stories, and onboarding).

