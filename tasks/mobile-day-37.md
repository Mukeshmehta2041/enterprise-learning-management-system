# Mobile Day 37 – i18n and localization for the mobile app

**Focus:** Prepare the mobile app for multiple languages and regional formats.

**References:** i18n library docs for React Native (e.g. `react-i18next`, `react-intl`), [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | i18n and localization being introduced to the mobile app. |
| ✅ Done | Core mobile flows support translation and locale-aware formatting. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 37 is done_

---

## Checklist

### 1. i18n infrastructure

- [ ] Integrate an i18n library appropriate for React Native with support for multiple locales.
- [ ] Configure loading of translation resources and default locale selection.

### 2. Externalizing strings

- [ ] Externalize user-facing strings in high-traffic screens (auth, navigation, catalog, key actions).
- [ ] Establish a naming convention and file organization for translation keys.

### 3. Locale-aware formatting

- [ ] Use locale-aware APIs for dates, times, numbers, and currencies displayed in the app.
- [ ] Consider RTL support if required: verify layout and mirroring for an RTL locale.

### 4. Testing

- [ ] Add simple tests or stories confirming alternate locales render correctly.
- [ ] Manually switch device/app locale and verify text and layouts.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 37 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 37 is complete. Next: [Mobile Day 38](mobile-day-38.md) (Error observability and crash reporting on mobile).

