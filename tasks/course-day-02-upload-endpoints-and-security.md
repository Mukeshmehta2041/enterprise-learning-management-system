# Course Day 2 – Upload endpoints & security

**Focus:** Design secure media upload flows (initiate, upload, complete) with strong authorization, using pre-signed URLs or upload tokens to keep video upload smooth and safe.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Backend upload initiation, presigned URL generation, and completion endpoints implemented with S3 integration. |
| ✅ Done | |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [x] **Upload initiation endpoint**: Add an endpoint for instructors to initiate an upload (validates ownership, lecture/course, file type, size limits).
- [x] **Pre-signed URLs / tokens**: Implement generation of pre-signed URLs or secure upload tokens scoped to a single upload with strict expiry and permissions.
- [x] **Upload-complete endpoint**: Implement an endpoint that finalizes the upload, validates the object, and moves lecture/media into a `processing` state.
- [x] **Validation & limits**: Enforce file type and size limits, and reject uploads that violate policy; log security-relevant events.
- [x] **Auth & roles**: Ensure all upload-related endpoints are protected by auth middleware and role checks (instructor-only, course ownership).

### Frontend

- [ ] **Multi-step upload flow**: Implement the instructor upload UI flow: choose file, see validation errors, show progress based on upload state.
- [ ] **Progress & errors**: Display friendly progress indicators and error messages for common failures (network, validation, expired URL).
- [ ] **Retry strategy**: Decide and document how the frontend handles retries (re-initiate upload vs. resume, what the user sees).

### Mobile

- [ ] **Upload from mobile**: Define whether and how instructors can upload lectures from mobile (if allowed), including constraints around large files and backgrounding.
- [ ] **Basic progress UI**: Implement a simple upload progress view that works well on mobile networks (edge cases: app minimized, poor connectivity).
- [ ] **Security checks**: Ensure mobile uses the same secure upload-init and complete endpoints and does not expose raw storage credentials.

---

## Done?

When all checkboxes above are done, Course Day 2 is complete. Next: [Course Day 3 – File processing & metadata](course-day-03-file-processing-and-metadata.md).

