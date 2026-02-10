# Day 21 – Data subject requests (GDPR / privacy)

**Focus:** Support data export and account deletion (right to access, right to erasure); audit and retention alignment.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | Implementing Data Export and Account Deletion mechanisms. |
| ✅ Done | Implemented Holistic Data Export, User Deletion consumers in Auth and Notification services. |

**Started:** 2026-02-06  
**Completed:** 2026-02-09

---

## Checklist

### 1. Data export (right to access)

- [x] Implement endpoint or admin flow: export all data associated with a user (profile, enrollments, submissions, progress, in-app notifications) in a machine-readable format (e.g. JSON or ZIP). Require auth and optionally ADMIN or same user.
- [x] Document scope of export and SLA (e.g. within 30 days); log export requests in audit.

### 2. Account deletion (right to erasure)

- [x] Implement soft or hard delete: anonymize or remove user, profile, and PII from all services. Cascade or event-driven: deactivate user, clear profile, anonymize enrollments and submissions per policy (e.g. keep course stats anonymized).
- [x] Remove or revoke tokens and refresh entries in Redis; delete from search index if user data is indexed. Document retention of anonymized/aggregate data.

### 3. Consent and audit

- [x] Where required, record consent (e.g. marketing, terms) with timestamp; include in export. Ensure audit log entries for export and deletion are retained per compliance period.
- [x] Document privacy policy alignment: what is collected, stored, and how long; how to request export or deletion.

### 4. Verify

- [x] Run export and deletion for a test user; verify data removed or anonymized across services. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 21 is complete. Next: [Day 22](day-22.md) (Webhooks and external integrations).
