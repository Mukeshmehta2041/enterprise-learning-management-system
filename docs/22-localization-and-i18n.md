# Localization and i18n (Internationalization)

## Overview
The LMS supports multiple languages for API error messages, success responses, and metadata. This ensures a friction-less experience for users across different regions.

## 1. Locale Resolution
The backend uses the standard HTTP `Accept-Language` header to determine the requested locale.
- **Default Locale:** `en` (English)
- **Supported Locales:** `en`, `es` (Spanish)

### Locale Filter
A `LocaleFilter` in `lms-common` intercepts every request, extracts the first language from `Accept-Language`, and sets it in the `LocaleContextHolder`.

## 2. Localized Error Messages
We use Spring's `MessageSource` to resolve error codes to human-readable messages in the target language.

### Stable Error Codes
All API errors return a stable machine-readable code and a localized message:
```json
{
  "code": "COURSE_NOT_FOUND",
  "message": "No se encontró el curso con ID abc-123.",
  "timestamp": "2026-02-09T10:00:00Z"
}
```

### Resource Bundles
Translations are stored in properties files within each service:
- `src/main/resources/messages/errors_en.properties`
- `src/main/resources/messages/errors_es.properties`

## 3. Best Practices
- **Never Hardcode Strings:** All user-facing strings in the API should be moved to resource bundles.
- **Stable Codes:** Never change the `code` field (e.g., `USER_NOT_FOUND`), as clients use it for branching logic.
- **Placeholder Support:** Use `{0}`, `{1}` etc. in properties files for dynamic values.
- **Frontend Formatting:** Dates, times, and currency amounts should be sent in raw ISO 8601 or decimal format; the frontend/mobile client is responsible for localizing these according to the user's device settings.

## 4. Content Localization (Future)
For actual course content (titles, descriptions):
- A `translations` field (JSONB) can be added to the `courses` table.
- Alternatively, a separate `course_translations` table can store values for each locale.
- The service will return the translation matching `Accept-Language` or fall back to the default.
