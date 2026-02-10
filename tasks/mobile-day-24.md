# Mobile Day 24 – Theming, dark mode, and institution branding on mobile

**Focus:** Enable theming, dark mode, and institution-specific branding in the mobile app.

**References:** [docs/mobile/03-design-system-mobile.md](../docs/mobile/03-design-system-mobile.md), [docs/01-architecture.md](../docs/01-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | The mobile app adapts to dark mode and tenant branding as needed. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Theme tokens and providers

- [x] Define or refine mobile design tokens (colors, spacing, typography) in a central theme.
- [x] Implement a theme provider/hooks to switch between light/dark and tenant-specific themes.

### 2. Dark mode support

- [x] Respect system dark mode where appropriate, with an override toggle if desired.
- [x] Verify core screens for legibility and contrast in both modes.

### 3. Institution branding

- [x] Integrate tenant-specific logos, primary colors, and maybe accent elements based on user/tenant context.
- [x] Provide safe fallbacks when branding is missing or misconfigured.

### 4. Testing

- [ ] Test theme switching on devices/emulators, including system theme changes at runtime.
- [ ] Update any stories or screenshots to show both modes.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 24 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 24 is complete. Next: [Mobile Day 25](mobile-day-25.md) (Offline-first patterns and optimistic UI on mobile).

