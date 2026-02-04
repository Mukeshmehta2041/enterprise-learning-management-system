# Day 42 – Localization and i18n (API and content)

**Focus:** Support multiple locales for API messages and optional content; Accept-Language and locale in responses; structured error codes.

**References:** [docs/10-best-practices.md](../docs/10-best-practices.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 42 is done_

---

## Checklist

### 1. Locale and headers

- [ ] Accept `Accept-Language` (e.g. `en`, `es`, `fr`) at gateway or service; resolve to supported locale (default en). Pass locale to services via header or context; use for error messages and optional content.
- [ ] Document supported locales and fallback (e.g. en if translation missing). Include locale or `Content-Language` in response where relevant.

### 2. Error messages and codes

- [ ] Use stable error codes (e.g. `USER_NOT_FOUND`, `COURSE_PUBLISHED`) in API error body; message can be localized. Store translations in resource bundles or DB; server returns message in requested language when available.
- [ ] Clients can rely on code for logic; display message to user. Document all error codes and example messages per locale.

### 3. Content and metadata

- [ ] Optional: course title/description in multiple languages (separate columns or JSON); return based on `Accept-Language`. Search index may need per-locale fields.
- [ ] Dates and numbers: use ISO 8601 and consistent number format; client can format for locale.

### 4. Verify

- [ ] Call API with `Accept-Language: es`; confirm error message in Spanish (or fallback). Document i18n approach. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 42 is complete. Next: [Day 43](day-43.md) (Cost optimization and rightsizing).
