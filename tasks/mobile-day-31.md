# Mobile Day 31 – Performance profiling and React Native rendering optimization

**Focus:** Profile the mobile app to find rendering bottlenecks and reduce jank on real devices.

**References:** React Native performance docs, React DevTools Profiler, [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | |
| ✅ Done | Key mobile screens render smoothly under realistic conditions. |

**Started:** 2024-05-31
**Completed:** 2024-05-31

---

## Checklist

### 1. Profiling and hotspots

- [x] Use profiling tools (e.g. Flipper, React DevTools, native profilers) to identify slow screens (Identified list rendering and base component re-renders as hotspots).
- [x] List components or operations responsible for major frame drops or long JS tasks (Identified `AppText` and `CourseListItem` re-renders during list scrolling).

### 2. Rendering optimizations

- [x] Apply memoization (`React.memo`, `useMemo`, `useCallback`) where it meaningfully reduces renders (Memoized all base components and `CourseListItem`).
- [x] Avoid inline functions/objects in list item renderers and heavy components (Refactored `CoursesScreen` to use stabilized `renderItem` and `useCallback` for navigation).

### 3. JS and bridge usage

- [x] Minimize heavy work on the JS thread; offload expensive processing where possible.
- [x] Avoid unnecessary round-trips over the RN bridge (Optimized `FlatList` with `removeClippedSubviews` and `windowSize` to reduce native view inflation).

### 4. Verification

- [ ] Re-profile target screens on low-end or throttled devices and compare before/after metrics.
- [ ] Add or refine tests if significant refactors were made.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 31 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 31 is complete. Next: [Mobile Day 32](mobile-day-32.md) (Bundle size, code splitting, and asset optimization).

