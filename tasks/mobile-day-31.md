# Mobile Day 31 – Performance profiling and React Native rendering optimization

**Focus:** Profile the mobile app to find rendering bottlenecks and reduce jank on real devices.

**References:** React Native performance docs, React DevTools Profiler, [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile performance profiling and optimizations underway. |
| ✅ Done | Key mobile screens render smoothly under realistic conditions. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 31 is done_

---

## Checklist

### 1. Profiling and hotspots

- [ ] Use profiling tools (e.g. Flipper, React DevTools, native profilers) to identify slow screens.
- [ ] List components or operations responsible for major frame drops or long JS tasks.

### 2. Rendering optimizations

- [ ] Apply memoization (`React.memo`, `useMemo`, `useCallback`) where it meaningfully reduces renders.
- [ ] Avoid inline functions/objects in list item renderers and heavy components.

### 3. JS and bridge usage

- [ ] Minimize heavy work on the JS thread; offload expensive processing where possible.
- [ ] Avoid unnecessary round-trips over the RN bridge (e.g. chatty native modules).

### 4. Verification

- [ ] Re-profile target screens on low-end or throttled devices and compare before/after metrics.
- [ ] Add or refine tests if significant refactors were made.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 31 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 31 is complete. Next: [Mobile Day 32](mobile-day-32.md) (Bundle size, code splitting, and asset optimization).

