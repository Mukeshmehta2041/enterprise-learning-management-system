# Course Day 15 – Notifications around lectures & assignments

**Focus:** Notify learners about new or updated lectures and important assignment events, with sensible defaults and user controls.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Key lecture and assignment events trigger useful, controllable notifications across devices. |

**Started:** 2026-02-12  
**Completed:** 2026-02-12  

---

## Checklist

### Backend

- [x] **Event definitions**: Define events for lecture published/updated, assignment created/updated/due-soon, and assignment graded.
- [x] **Notification triggers**: Implement producers or services that emit these events to the notification system.
- [x] **Preferences model**: Design notification preferences (per user, per course, per channel) and expose APIs to manage them.

### Frontend

- [x] **Notification settings UI**: Add a UI for learners to manage notification preferences for lecture and assignment events.
- [x] **In-app notifications**: Ensure in-app notification center surfaces these events with links to the relevant lecture or assignment.
- [x] **Email/push hooks**: Coordinate with backend to verify email/push channels behave as expected for web users.

### Mobile

- [x] **Push notification handling**: Implement handling for push notifications about lectures and assignments, with deep links into the app.
- [x] **Mobile settings screen**: Add mobile UI for notification preferences that stays in sync with backend.
- [x] **In-app notification feed**: Ensure the mobile notification feed shows these events clearly and supports quick actions where appropriate.

---

## Done?

When all checklists above are done, Course Day 15 is complete. Next: [Course Day 16 – Access tiers & monetization interaction with courses](course-day-16-access-tiers-and-monetization.md).

