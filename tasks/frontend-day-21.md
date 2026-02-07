# Frontend Day 21 – Privacy, consent, and user data settings UI

**Focus:** Give learners and instructors clear control over privacy, data usage, and communication preferences.

**References:** [docs/07-security.md](../docs/07-security.md), [tasks/day-21.md](day-21.md) if present.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Privacy center, communication preferences, and data subject actions UI implemented. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Privacy center entry point

- [x] Add a “Privacy & Settings” or similar entry point from the profile/account area.
- [x] Clearly explain what users can control here (email preferences, data exports, tracking, etc.).

### 2. Communication and notification preferences

- [x] Provide toggles for marketing emails, product updates, and course-related notifications (as supported by backend).
- [x] Ensure these settings are persisted via appropriate APIs and reflected in the UI.

### 3. Data and tracking controls

- [x] Surface options for analytics/tracking consent where required (cookie banner or preferences panel).
- [x] Link to privacy policy and terms of service in relevant locations.

### 4. Data subject actions (UI only)

- [x] Add UI hooks for data subject requests (e.g. “Request data export”, “Request account deletion”) that call or queue backend workflows.
- [x] Show clear confirmation and timelines (e.g. “We’ll process this within X days”) where applicable.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 21 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 21 is complete. Next: [Frontend Day 22](frontend-day-22.md) (Notifications center and in-app messaging).

