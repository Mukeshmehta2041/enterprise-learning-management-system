# Mobile Day 15 – Mobile state management and React Query patterns

**Focus:** Consolidate local and server state patterns in the mobile app for clarity, performance, and reliability.

**References:** [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Clear separation of server/client state with consistent mobile-friendly patterns and custom hooks. |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. State inventory

- [x] Identified global state: Auth (Zustand), Notifications (Zustand), Server Data (React Query).
- [x] Reviewed screen state complexity.

### 2. Server state with React Query

- [x] Moved server-derived data (courses, enrollments) into shared custom hooks in `src/hooks`.
- [x] Standardized cache invalidation patterns in mutation hooks.

### 3. Client-only state

- [x] Consolidated client-only state into focused Zustand stores (`useAuthStore`, `useNotificationStore`).
- [x] Reduced prop drilling by using hooks and global state.

### 4. Refactor and test

- [x] Refactored `CoursesScreen` and `CourseDetailScreen` to use the new custom hooks.
- [x] Ensured consistent error reporting via the notification banner system.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Mobile Day 15 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 15 is complete. Next: [Mobile Day 16](mobile-day-16.md) (Role-based mobile UI and permissions).

