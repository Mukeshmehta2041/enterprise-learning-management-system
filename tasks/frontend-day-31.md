# Frontend Day 31 – Performance profiling and React rendering optimization

**Focus:** Identify performance bottlenecks in the frontend and reduce unnecessary renders and expensive computations.

**References:** Browser DevTools performance tab, React DevTools Profiler, [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Performance profiling and optimizations underway. |
| ✅ Done | Key screens render efficiently under realistic loads. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 31 is done_

---

## Checklist

### 1. Profiling and hotspots

- [ ] Use React DevTools Profiler and browser performance tools to identify slow screens (e.g. large course lists, analytics).
- [ ] Capture a short list of components causing most renders or heavy work.

### 2. Rendering optimizations

- [ ] Apply memoization (`React.memo`, `useMemo`, `useCallback`) judiciously for expensive components and stable props.
- [ ] Avoid unnecessary re-renders by tightening context providers and props.
- [ ] Remove or throttle expensive synchronous work in render paths.

### 3. Data and state efficiency

- [ ] Ensure data fetching does not re-run unnecessarily (correct React Query keys and options).
- [ ] Consider normalizing large collections where it simplifies updates.

### 4. Verification

- [ ] Re-profile key screens after changes and document improvements (e.g. render count, interaction time).
- [ ] Add or update tests if refactors were significant.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 31 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 31 is complete. Next: [Frontend Day 32](frontend-day-32.md) (Code splitting, lazy loading, and bundle analysis).

