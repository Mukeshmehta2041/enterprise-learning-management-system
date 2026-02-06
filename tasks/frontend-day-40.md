# Frontend Day 40 – Frontend security hardening and threat modeling

**Focus:** Systematically review and harden the frontend against common web threats.

**References:** [docs/07-security.md](../docs/07-security.md), OWASP Cheat Sheets, [tasks/day-40.md](day-40.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Frontend security review and hardening in progress. |
| ✅ Done | Major client-side security concerns identified and addressed. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 40 is done_

---

## Checklist

### 1. Threat modeling (frontend focus)

|- [ ] Identify key threats: XSS, CSRF (if relevant), clickjacking, token leakage, sensitive data exposure, injection via user content.|
|- [ ] Document how existing architecture mitigates these threats (CSP, escaping, secure storage, etc.).|

### 2. XSS and content handling

- [ ] Audit use of `dangerouslySetInnerHTML` or similar APIs and ensure they are sanitized.
- [ ] Ensure user-generated content is escaped and/or sanitized before rendering.

### 3. Token and credential handling

- [ ] Verify that access tokens are stored securely (e.g. httpOnly cookies vs localStorage trade-offs as chosen).
- [ ] Avoid logging sensitive tokens or PII in the browser console or error tracking.

### 4. Browser security headers and framing

- [ ] Coordinate with backend/gateway to ensure CSP, X-Frame-Options/`frame-ancestors`, and other headers are set.
- [ ] Confirm frontends are not embedded in untrusted iframes unless explicitly required.

### 5. Verification

- [ ] Run basic security scanners or checklists against the frontend where feasible.
- [ ] Document findings, mitigations, and follow-ups for future days.

### 6. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 40 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 40 is complete. Next: [Frontend Day 41](frontend-day-41.md) (Admin dashboards and feature flags).

