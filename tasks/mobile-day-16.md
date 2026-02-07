# Mobile Day 16 – Role-based mobile UI and permissions

**Focus:** Enforce role-based access and visibility in the mobile UI so learners, instructors, and admins only see what they should.

**References:** [docs/mobile/05-auth-and-security-mobile.md](../docs/mobile/05-auth-and-security-mobile.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Mobile UI consistently reflects user roles (Student, Instructor, Admin). |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Roles and permissions in mobile state

- [x] Confirmed roles `STUDENT`, `INSTRUCTOR`, `ADMIN` are used.
- [x] Implemented `useRole` hook in `src/hooks/useRole.ts` to expose role flags.

### 2. Navigation-level guards

- [x] Conditionally hide "Assignments" tab for non-students (or handle different views).
- [x] Ensured tab navigation reflects the current user's role.

### 3. Screen and component visibility

- [x] Modified Course Detail screen to show "Edit Course" for authors/instructors.
- [x] Disabled "Enroll Now" for admins and authors of the course.
- [x] Hidden or restricted access to student-specific features for instructors.

### 4. Testing and UAT

- [x] Verified role-based button visibility on Course Detail screen.
- [x] Verified tab filtration in `TabLayout`.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Mobile Day 16 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 16 is complete. Next: [Mobile Day 17](mobile-day-17.md) (Complex mobile forms, validation, and wizards).

