# Frontend Day 34 – Caching strategy, stale-while-revalidate, and background refresh

**Focus:** Use smart caching and background refresh to keep data fresh without hurting perceived performance.

**References:** [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Caching and background refresh strategy being tuned. |
| ✅ Done | Key data is cached appropriately and refreshed smoothly. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 34 is done_

---

## Checklist

### 1. Caching policy review

- [ ] Review current React Query (or equivalent) cache times and refetch strategies for main resources.
- [ ] Decide which data can be cached longer and which should stay fresh.

### 2. Stale-while-revalidate patterns

- [ ] Enable stale-while-revalidate for lists and dashboards where a brief staleness is acceptable.
- [ ] Ensure the UI shows existing data immediately while refreshing in the background.

### 3. Background refresh and focus

- [ ] Configure refetch-on-focus or interval-based refresh only where necessary to avoid unnecessary load.
- [ ] Provide manual refresh actions (e.g. “Refresh data” button) on heavy dashboards.

### 4. Verification

- [ ] Monitor network requests while interacting with the app to confirm expected caching behavior.
- [ ] Add tests for at least one hook to ensure caching options are set as intended.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 34 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 34 is complete. Next: [Frontend Day 35](frontend-day-35.md) (Design system hardening and design tokens).

