# Day 13 – RBAC refinement and resource-level authorization

**Focus:** Enforce resource-level permissions (e.g. instructor of course, owner of enrollment); consistent permission model across services.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented resource-level authorization in Course, Enrollment, Assignment, and Content services. Consolidated common security context and exceptions in lms-common. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06  

---

## Checklist

### 1. Permission model

- [x] Document and implement resource-level rules: who can read/update/delete course (instructor, admin); who can grade assignment (instructor of course); who can see enrollment list (instructor, admin, or own).
- [x] Use `X-User-Id` and `X-Roles` from gateway; add service-level checks so backend never trusts client-only claims for sensitive actions.

### 2. Course and module ownership

- [x] Course Service: restrict create/update/delete course to ADMIN or assigned instructor; list “my courses” for instructors; students see only published courses.
- [x] Store and check `course_instructors` (or equivalent); reject write if user is not instructor or admin.

### 3. Enrollment and progress

- [x] Enrollment Service: students can only create enrollment for themselves; instructors/admins can list enrollments for a course; only enrolled user (or instructor) can update progress.

### 4. Assignment and content

- [x] Assignment Service: only instructor of course can create/update assignment and grade submissions; students can submit for themselves.
- [x] Content Service: only course owner/instructor can create/update/delete content; students have read-only access per enrollment.

### 5. Verify

- [x] Test each role (student, instructor, admin) against protected endpoints; expect 403 where appropriate. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 13 is complete. Next: [Day 14](day-14.md) (Audit logging and compliance).
