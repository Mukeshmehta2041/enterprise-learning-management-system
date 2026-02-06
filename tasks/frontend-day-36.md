# Frontend Day 36 – Component library cleanup and API ergonomics

**Focus:** Simplify and standardize component APIs to reduce duplication and make building new screens faster.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Component library cleanup underway. |
| ✅ Done | Shared components are well-factored, documented, and pleasant to use. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 36 is done_

---

## Checklist

### 1. Inventory and deduplication

- [ ] List commonly used components (buttons, inputs, modals, cards, tables, layout wrappers).
- [ ] Identify duplicates or near-duplicates across feature folders and consolidate them.

### 2. API ergonomics

- [ ] Simplify props for shared components, removing rarely used options or combining patterns.
- [ ] Ensure components follow consistent naming and behavior patterns (e.g. `onClose` vs `onDismiss`).

### 3. Composition and flexibility

- [ ] Favor composition (children, render props) over deeply nested prop structures where it improves clarity.
- [ ] Add sensible defaults for common use cases to reduce boilerplate.

### 4. Documentation and tests

- [ ] Update Storybook stories or documentation to show recommended usage patterns.
- [ ] Add or update tests for critical shared components after refactors.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 36 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 36 is complete. Next: [Frontend Day 37](frontend-day-37.md) (Internationalization – i18n and localization – l10n).

