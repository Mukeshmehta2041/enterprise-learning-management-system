# Frontend Day 37 – Internationalization (i18n) and localization (l10n)

**Focus:** Prepare the LMS frontend for multiple languages and regional formats.

**References:** i18n library docs (e.g. `react-intl`, `react-i18next`), [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | i18n and localization being introduced. |
| ✅ Done | Core flows support translation and locale-aware formatting. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 37 is done_

---

## Checklist

### 1. i18n infrastructure

- [ ] Choose or confirm your i18n library and setup (message catalogs, locale selection).
- [ ] Wrap the app in a localization provider and configure at least one non-default locale.

### 2. Externalizing strings

- [ ] Externalize user-facing strings in key flows (auth, navigation, course catalog, core actions).
- [ ] Use consistent message keys and organize them by domain or feature.

### 3. Locale-aware formatting

- [ ] Use locale-aware formatting for dates, times, numbers, and currencies where visible to users.
- [ ] Ensure right-to-left (RTL) support is considered if in scope (basic checks at least).

### 4. Testing and UX

- [ ] Add basic tests or stories to verify alternate locale behavior.
- [ ] Manually toggle languages and verify layout and spacing still work.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 37 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 37 is complete. Next: [Frontend Day 38](frontend-day-38.md) (Error observability, logging, and frontend alerts).

