# Mobile Day 16 – Role-based mobile UI and permissions

**Focus:** Enforce role-based access and visibility in the mobile UI so learners, instructors, and admins only see what they should.

**References:** [docs/mobile/05-auth-and-security-mobile.md](../docs/mobile/05-auth-and-security-mobile.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Role-based mobile UI and guards being implemented. |
| ✅ Done | Mobile UI consistently reflects user roles and permissions. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 16 is done_

---

## Checklist

### 1. Roles and permissions in mobile state

- [ ] Confirm roles/claims available in tokens or user profile (e.g. `LEARNER`, `INSTRUCTOR`, `ADMIN`).
- [ ] Extend auth context/store to expose role/permission info in a typed way.
- [ ] Add helper hooks (e.g. `useHasRole`, `useCan(action, resource)`) for mobile screens.

### 2. Navigation-level guards

- [ ] Restrict instructor/admin-only stacks or tabs based on role.
- [ ] Ensure unauthorized users are redirected to an appropriate screen (e.g. learner home).

### 3. Screen and component visibility

- [ ] Hide or disable actions that current user cannot perform (e.g. “Create course” from mobile).
- [ ] Show brief explanations when actions are disabled due to permission (where useful).

### 4. Testing and UAT

- [ ] Add tests for at least one role-restricted screen.
- [ ] Verify behavior using sample accounts (learner vs instructor vs admin) on device/emulator.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 16 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 16 is complete. Next: [Mobile Day 17](mobile-day-17.md) (Complex mobile forms, validation, and wizards).

