# Frontend Day 33 – List virtualization and heavy screen optimization

**Focus:** Optimize screens that render large lists or tables using virtualization and smart rendering strategies.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), virtualization library docs if used.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Heavy lists and screens being optimized. |
| ✅ Done | Large lists remain smooth and responsive under load. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 33 is done_

---

## Checklist

### 1. Identify heavy lists

- [ ] List out pages that may show many rows/items (courses, users, enrollments, submissions, logs).
- [ ] Profile at least one of these pages with a large dataset.

### 2. Virtualization

- [ ] Introduce list/table virtualization where appropriate (e.g. `react-window`, `react-virtualized`, or similar).
- [ ] Ensure virtualized lists still support keyboard navigation and screen readers as much as possible.

### 3. Rendering hygiene

- [ ] Avoid expensive cell renderers; memoize heavy row components.
- [ ] Limit the amount of dynamic layout thrash (e.g. avoid layout shifts from lazy images without dimensions).

### 4. Verification

- [ ] Test virtualized lists on low-power devices or throttled CPU in devtools.
- [ ] Add tests or storybook scenarios for large lists to guard against regressions.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 33 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 33 is complete. Next: [Frontend Day 34](frontend-day-34.md) (Caching strategy, stale-while-revalidate, and background refresh).

