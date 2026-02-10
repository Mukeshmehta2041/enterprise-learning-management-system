# Mobile Day 33 – Large lists, virtualization, and infinite scroll on mobile

**Focus:** Optimize large mobile lists using proper virtualization and infinite scroll patterns.

**References:** React Native `FlatList`/`SectionList` docs, [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | Large lists and infinite scroll being optimized. |
| ✅ Done | List-heavy screens are smooth and responsive on mobile. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 33 is done_

---

## Checklist

### 1. Identify heavy lists

- [ ] Identify screens with potentially long lists (courses, users, submissions, logs).
- [ ] Profile scroll performance on devices for these screens.

### 2. Virtualization best practices

- [ ] Ensure lists use `FlatList`/`SectionList` with stable `keyExtractor` values.
- [ ] Tune props (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`) for performance.

### 3. Infinite scroll and pull-to-refresh

- [ ] Implement infinite scroll (`onEndReached`) where backends support pagination.
- [ ] Add pull-to-refresh where appropriate, respecting network and battery usage.

### 4. Testing

- [ ] Manually test with large datasets, fast scrolling, and device rotations.
- [ ] Add tests or stories demonstrating expected list behavior.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 33 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 33 is complete. Next: [Mobile Day 34](mobile-day-34.md) (Data caching strategy and background refresh on mobile).

