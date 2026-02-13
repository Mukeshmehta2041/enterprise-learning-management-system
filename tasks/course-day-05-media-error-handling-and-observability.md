# Course Day 5 – Media error handling & observability

**Focus:** Make media upload and playback robust by standardizing error codes, logging, and monitoring so issues can be detected and debugged quickly.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/09-devops.md](../docs/09-devops.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | |
| ✅ Done | Media-related errors are well-defined, observable, and surfaced with clear UX. |

**Started:** 2026-02-11  
**Completed:** 2026-02-11

---

## Checklist

### Backend

- [x] **Error taxonomy**: Define a set of media-specific error codes (upload failures, processing failures, access denied, unsupported format, size limit exceeded).
- [x] **Consistent responses**: Ensure all media and lecture endpoints return structured error responses aligned with the global error model.
- [x] **Logging & tracing**: Add structured logging and tracing around upload, processing, and playback-token endpoints, including correlation IDs.
- [x] **Metrics & alerts**: Expose metrics (error rates, processing duration, failure counts) and configure basic alerts for problematic trends.

### Frontend

- [ ] **User-friendly messages**: Map backend error codes into user-friendly messages in upload and lecture management UIs.
- [ ] **Retry & recovery UX**: Decide when to encourage retry vs. contact support, and implement corresponding UI patterns.
- [ ] **Client-side logging**: Optionally capture client-side errors for upload and playback flows and send them to a logging/analytics sink.

### Mobile

- [ ] **Clear mobile error states**: Show concise, localized error messages for upload and playback issues on mobile.
- [ ] **Offline/poor network handling**: Handle offline or poor network conditions gracefully with retry options and clear indicators.
- [ ] **Minimal telemetry**: Capture basic telemetry from the mobile app for upload/playback errors to help correlate with backend logs.

---

## Done?

When all checkboxes above are done, Course Day 5 is complete. Next: [Course Day 6 – Playback tokenization & authorization](course-day-06-playback-tokenization-and-authorization.md).

