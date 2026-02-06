# Mobile Day 34 – Data caching strategy and background refresh on mobile

**Focus:** Tune data caching and background refresh for the mobile app to balance freshness and performance.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), React Query docs (or your data layer).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile caching and background refresh strategies being tuned. |
| ✅ Done | Key data remains reasonably fresh without overloading devices or network. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 34 is done_

---

## Checklist

### 1. Caching policy review

- [ ] Review cache times and refetch settings for major queries (courses, enrollments, notifications).
- [ ] Decide which queries tolerate stale data and which must be fresh.

### 2. Stale-while-revalidate

- [ ] Apply stale-while-revalidate patterns where users can see cached data while a background refresh runs.
- [ ] Provide subtle indicators when data is out-of-date and being refreshed.

### 3. Background refresh

- [ ] Use app focus or periodic refresh for critical data (e.g. notifications, active enrollments) with reasonable intervals.
- [ ] Avoid aggressive background polling that drains battery or data.

### 4. Verification

- [ ] Monitor network usage and perceived performance while navigating typical flows.
- [ ] Add tests to ensure cache settings are applied correctly on key hooks.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 34 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 34 is complete. Next: [Mobile Day 35](mobile-day-35.md) (Mobile design system hardening and tokens).

