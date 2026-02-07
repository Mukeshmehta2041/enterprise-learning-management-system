# Mobile Day 14 – Deep linking, navigation params, and URL schemes

**Focus:** Support deep links and URL schemes so users can jump directly into specific parts of the app from emails, push, or web.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), platform docs for deep linking (Android/iOS, Expo if used).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | The app reliably handles deep links into key flows, including post-auth redirection. |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Deep linking configuration

- [x] Configure native/linking settings (URL scheme `lms-mobile` defined in `app.json`).
- [x] Define set of deep-linkable routes (Courses, Lessons, Assignments).

### 2. Navigation params and handling

- [x] Ensure navigation routes accept and validate params from deep links (using `useLocalSearchParams`).
- [x] Handle cases when the user is not authenticated: Implement `redirectPath` in `useAuthStore` and handle it in `RootLayout` and `LoginScreen`.

### 3. Testing entry points

- [x] Documented deep link testing commands in `mobile/README.md`.
- [x] Verified that opening links while unauthenticated correctly prompts for login before proceeding to target.

### 4. Progress update

- [x] Update the **Progress** table at the top of this file when Mobile Day 14 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 14 is complete. Next: [Mobile Day 15](mobile-day-15.md) (Mobile state management and React Query patterns).

