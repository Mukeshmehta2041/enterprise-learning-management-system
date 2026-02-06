# Mobile Day 14 – Deep linking, navigation params, and URL schemes

**Focus:** Support deep links and URL schemes so users can jump directly into specific parts of the app from emails, push, or web.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), platform docs for deep linking (Android/iOS, Expo if used).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Deep linking and navigation params being implemented. |
| ✅ Done | The app reliably handles deep links into key flows. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 14 is done_

---

## Checklist

### 1. Deep linking configuration

- [ ] Configure native/linking settings (URL scheme and universal links/app links) for Android and iOS.
- [ ] Define set of deep-linkable routes (e.g. course details, assignment details, notifications).

### 2. Navigation params and handling

- [ ] Ensure navigation routes accept and validate params from deep links.
- [ ] Handle cases when the user is not authenticated (e.g. route to login, then navigate to target).

### 3. Testing entry points

- [ ] Test deep links from CLI, email links, or QR codes into simulators/devices.
- [ ] Confirm that opening links while the app is in background or foreground behaves correctly.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 14 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 14 is complete. Next: [Mobile Day 15](mobile-day-15.md) (Mobile state management and React Query patterns).

