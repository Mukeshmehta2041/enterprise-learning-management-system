# Mobile Day 11 – Mobile API contracts, types, and error modeling

**Focus:** Align the mobile app tightly with backend API contracts using typed clients and consistent error handling tailored for mobile UX.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/](../docs/api-specs/), [tasks/day-11.md](day-11.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile API contracts and error modeling being implemented. |
| ✅ Done | Mobile API contracts, typings, and error handling aligned with backend specs. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 11 is done_

---

## Checklist

### 1. Type-safe mobile API layer

- [ ] Review backend OpenAPI specs for User, Auth, Course, Enrollment, and other services used on mobile.
- [ ] Generate or hand-write TypeScript types for key request/response models used by the mobile app.
- [ ] Ensure the mobile API client and React Query hooks use these types end-to-end.

### 2. Mobile-friendly error modeling

- [ ] Define a normalized `MobileAppError` (code, message, optional field errors, isRetryable).
- [ ] Map backend errors (validation, network, auth) into this structure in one place.
- [ ] Update screens and hooks to rely on this error shape rather than ad-hoc strings.

### 3. Contract validation and guards

- [ ] Add runtime guards (e.g. `zod`) for critical responses where backend shape changes would break mobile.
- [ ] Log unexpected contract mismatches in a way that’s visible in crash/error reporting.
- [ ] Add at least one test that fails if a key response structure changes.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 11 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 11 is complete. Next: [Mobile Day 12](mobile-day-12.md) (Mobile integration tests and API mocking).

