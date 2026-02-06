# Mobile Day 36 – Component library cleanup and hooks for mobile

**Focus:** Simplify and standardize the mobile component library and shared hooks to boost developer productivity.

**References:** [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md), [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile components and hooks being cleaned up. |
| ✅ Done | Shared mobile components and hooks are well-factored and easy to use. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 36 is done_

---

## Checklist

### 1. Inventory and consolidation

- [ ] List commonly used mobile components (buttons, cards, list items, modals, bottom sheets).
- [ ] Identify duplicated or slightly different versions of similar components and consolidate them.

### 2. Hook ergonomics

- [ ] Review custom hooks (e.g. `useAuth`, `useCourses`, `useNetworkStatus`) for clarity and consistency.
- [ ] Simplify hook APIs and ensure they return stable values to reduce re-renders.

### 3. API consistency

- [ ] Align prop names and patterns across components (e.g. `onPress`, `variant`, `size`).
- [ ] Provide sensible defaults for styling and behavior.

### 4. Tests and docs

- [ ] Add or update tests for key components and hooks after refactors.
- [ ] Document usage patterns in comments or mobile docs for future contributors.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 36 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 36 is complete. Next: [Mobile Day 37](mobile-day-37.md) (i18n and localization for the mobile app).

