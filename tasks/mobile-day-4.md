# Mobile Day 4 – Auth flows on mobile

**Focus:** Implement login and registration screens, wire them to backend Auth/User APIs, and manage auth state and protected navigation.

**References:** [docs/mobile/05-auth-and-security-mobile.md](../docs/mobile/05-auth-and-security-mobile.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/auth-service-api.md](../docs/api-specs/auth-service-api.md), [docs/api-specs/user-service-api.md](../docs/api-specs/user-service-api.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 4 implemented (mobile auth flows and session management) |

**Started:** Mobile Day 4  
**Completed:** -

---

## Checklist

### 1. API client and React Query

- [ ] Implement mobile API client module with base URL and error handling.
- [ ] Initialize React Query `QueryClient` and wrap the app in its provider.

### 2. Login and registration UI

- [ ] Implement `LoginScreen` with email/password fields, validation, and error display.
- [ ] Implement `RegisterScreen` aligned with the User Service API.
- [ ] Use shared form components from Day 3.

### 3. Session management

- [ ] Create an auth store/context to hold tokens and user object.
- [ ] On login success, store tokens securely and fetch the current user (`/auth/me` or `/users/me`).
- [ ] Implement logout: call `/auth/logout`, clear stored tokens, and navigate back to `AuthStack`.

### 4. Navigation guards

- [ ] Show `AuthStack` when unauthenticated and `MainTabs` when authenticated.
- [ ] Optionally hide instructor/admin-only screens when user roles do not allow access.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 4 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 4 is complete. Next: [Mobile Day 5](mobile-day-5.md) (Courses list & details screens).

