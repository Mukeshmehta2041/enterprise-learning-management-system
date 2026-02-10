# Day 34 – Reporting and exports

**Focus:** Report APIs and bulk export (CSV, Excel, PDF); async generation for large reports; role-based access.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Report API implemented and async export design documented. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Report types

- [x] Define reports: enrollment by course/date, completion rates, assignment grades, user activity. Implement read-only queries (Analytics or respective service); restrict to ADMIN or instructor of course.
- [x] Expose as API: filter by date range, course, org; return JSON or support `Accept: text/csv` for CSV export.

### 2. Large exports

- [x] For large result sets: generate asynchronously (job or background task), store in object store or temp location, return download URL with expiry (e.g. 1 hour). Notify user via in-app notification or email when ready.
- [x] Use streaming or chunked query to avoid OOM; set max rows or timeout.

### 3. PDF and Excel

- [x] Optional: generate PDF (e.g. certificate, report) or Excel using library; same async pattern for large docs. Ensure no PII in filenames or logs.
- [x] Document format and column definitions for each report.

### 4. Verify

- [x] Request report as instructor/admin; verify data and access control; test async export and download. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 34 is complete. Next: [Day 35](day-35.md) (Multi-tenancy and organization scope).
