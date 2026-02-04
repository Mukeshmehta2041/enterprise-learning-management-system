# Day 34 – Reporting and exports

**Focus:** Report APIs and bulk export (CSV, Excel, PDF); async generation for large reports; role-based access.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 34 is done_

---

## Checklist

### 1. Report types

- [ ] Define reports: enrollment by course/date, completion rates, assignment grades, user activity. Implement read-only queries (Analytics or respective service); restrict to ADMIN or instructor of course.
- [ ] Expose as API: filter by date range, course, org; return JSON or support `Accept: text/csv` for CSV export.

### 2. Large exports

- [ ] For large result sets: generate asynchronously (job or background task), store in object store or temp location, return download URL with expiry (e.g. 1 hour). Notify user via in-app notification or email when ready.
- [ ] Use streaming or chunked query to avoid OOM; set max rows or timeout.

### 3. PDF and Excel

- [ ] Optional: generate PDF (e.g. certificate, report) or Excel using library; same async pattern for large docs. Ensure no PII in filenames or logs.
- [ ] Document format and column definitions for each report.

### 4. Verify

- [ ] Request report as instructor/admin; verify data and access control; test async export and download. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 34 is complete. Next: [Day 35](day-35.md) (Multi-tenancy and organization scope).
