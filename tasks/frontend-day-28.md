# Frontend Day 28 – Advanced analytics UI and reporting exports

**Focus:** Enhance analytics dashboards with richer visualizations and export capabilities (CSV, PDF, etc.).

**References:** [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/04-database.md](../docs/04-database.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Instructors/admins have powerful, usable analytics tools in the UI. |

**Started:** 2026-02-07  
**Completed:** 2026-02-07

---

## Checklist

### 1. Richer visualizations

- [x] Upgrade analytics views with clearer charts (line, bar, pie) for key LMS metrics (enrollments over time, completion rates, engagement).
- [x] Ensure charts handle empty/low-data scenarios gracefully.

### 2. Filtering and comparison

- [x] Add filters (course, cohort, date range) to analytics dashboards.
- [x] Support simple comparisons (e.g. this month vs last month) where backend supports it.

### 3. Export and sharing

- [x] Implement CSV export for at least one analytics view (e.g. enrollments or grades).
- [x] Optionally support printable or PDF-friendly versions of key reports.

### 4. Tests and performance

- [x] Add tests for analytics data fetching and export triggers.
- [x] Verify dashboards remain responsive for larger datasets (consider pagination or aggregation).

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 28 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 28 is complete. Next: [Frontend Day 29](frontend-day-29.md) (Accessibility deep dive – WCAG, keyboard, screen readers).

