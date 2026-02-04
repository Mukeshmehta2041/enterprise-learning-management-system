# Day 40 – Developer portal and API keys

**Focus:** API key auth for server-to-server or partner access; developer portal for key management and docs; scope and rotation.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/03-api-gateway.md](../docs/03-api-gateway.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 40 is done_

---

## Checklist

### 1. API key model

- [ ] Store API keys: hashed value (never plain in DB), name, owner (user/org), scopes (e.g. read:courses, write:enrollments), created_at, last_used_at, optional expiry. Generate key on create (show once); support prefix (e.g. `lms_`) for identification.
- [ ] Validation at gateway: `Authorization: ApiKey <key>` or `X-API-Key`; lookup by prefix or hash; check scope and expiry. Set `X-User-Id` or service account for downstream; rate limit by key.

### 2. Developer portal

- [ ] Minimal portal or admin UI: register app, create API key, view scopes and usage (optional), rotate key (new key, old key grace period then invalidate). Link to API docs (OpenAPI) and getting-started guide.
- [ ] Self-service or admin-only key creation per policy; document acceptable use.

### 3. Scopes and rotation

- [ ] Define scopes per resource/action (e.g. `courses:read`, `enrollments:write`); enforce in gateway or service. Support key rotation: issue new key, allow both keys for N days, then revoke old.
- [ ] Optional: webhook signing secret per key or per app for outbound webhooks.

### 4. Verify

- [ ] Create API key; call API with key and correct scope; confirm 403 for missing scope and for invalid/expired key. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 40 is complete. Next: [Day 41](day-41.md) (Anomaly detection and alerting refinement).
