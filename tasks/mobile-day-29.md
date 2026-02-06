# Mobile Day 29 – Mobile accessibility, gestures, and screen readers

**Focus:** Ensure the mobile app is accessible for users relying on screen readers, keyboard navigation, and accessible gestures.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), platform accessibility guidelines (iOS/Android).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile accessibility improvements underway. |
| ✅ Done | Key mobile flows meet strong accessibility standards. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 29 is done_

---

## Checklist

### 1. Screen reader support

- [ ] Audit key screens (auth, catalog, course view, assignments) with VoiceOver/TalkBack.
- [ ] Add or refine `accessibilityLabel`, `accessibilityHint`, and roles where needed.

### 2. Touch targets and focus

- [ ] Ensure touch targets meet recommended minimum sizes.
- [ ] Verify a logical focus order for components when using screen readers.

### 3. Gestures and interactions

- [ ] Avoid relying solely on complex gestures (e.g. swipe-only actions) without alternate accessible controls.
- [ ] Provide visible affordances and fallback buttons for gesture-driven features.

### 4. Color and motion

- [ ] Check color contrast in light/dark modes for text and important UI elements.
- [ ] Respect reduced motion settings where supported by your stack.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 29 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 29 is complete. Next: [Mobile Day 30](mobile-day-30.md) (Mobile documentation, stories, and onboarding).

