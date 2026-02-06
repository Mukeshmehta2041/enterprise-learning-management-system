# Mobile Day 18 – Search, filtering, and pagination UX on mobile

**Focus:** Make large lists (courses, enrollments, assignments) easy to explore on small screens with good search and pagination patterns.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile search, filters, and pagination UX being improved. |
| ✅ Done | List-heavy screens are efficient and friendly to use on mobile. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 18 is done_

---

## Checklist

### 1. Search and filter components

- [ ] Build reusable mobile search bar component with debounced input and clear button.
- [ ] Implement filter sheets or drawers suitable for touch (bottom sheet or full-screen filter view).
- [ ] Ensure sort controls are easy to access on narrow screens.

### 2. Wiring to APIs and state

- [ ] Connect search, filter, and sort controls to backend APIs using query params.
- [ ] Persist search and filter state across navigations where it makes sense.

### 3. Pagination and infinite scroll

- [ ] Implement standard pagination or infinite scroll (e.g. `onEndReached`) for large lists.
- [ ] Show loading indicators at list bottom and handle “no more results” gracefully.

### 4. Testing and polish

- [ ] Add tests for at least one list screen covering search, filter, and pagination behavior.
- [ ] Manually test on devices for scroll performance and touch accuracy.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 18 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 18 is complete. Next: [Mobile Day 19](mobile-day-19.md) (Instructor tools and content workflows on mobile).

