# Mobile Day 6 – Content player and basic offline behavior

**Focus:** Implement a mobile content player for lessons and define minimal offline-friendly behavior for course/lesson viewing.

**References:** [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md), [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 6 implemented (content player and basic offline behavior) |

**Started:** Mobile Day 6  
**Completed:** -

---

## Checklist

### 1. Lesson detail and navigation

- [ ] Implement a `LessonScreen` reachable from `CourseDetailScreen` (e.g. tap a lesson).
- [ ] Show lesson title, type, and content area; include navigation to previous/next lessons.

### 2. Content player

- [ ] Integrate appropriate components for lesson types (e.g. video player for video, scrollable text for articles, basic webview for docs if needed).
- [ ] Ensure controls are usable on mobile and respect safe areas.

### 3. Data fetching and offline basics

- [ ] Use React Query hooks to fetch lesson content.
- [ ] Ensure previously loaded lesson data can still be shown if the network drops (stale data) while making it clear when offline.
- [ ] Display user-friendly offline and error messages with retry options.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 6 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 6 is complete. Next: [Mobile Day 7](mobile-day-7.md) (Enrollments & progress on mobile).

