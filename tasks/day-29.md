# Day 29 – Security audit and penetration testing

**Focus:** Security review of APIs and auth; dependency and container scanning; OWASP alignment and remediation.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 29 is done_

---

## Checklist

### 1. Dependency and image scanning

- [ ] Run dependency scan (e.g. OWASP Dependency-Check, Snyk, Dependabot) on all modules; fix or document accepted critical/high vulnerabilities. Integrate into CI; fail or warn on new high/critical.
- [ ] Scan container images for OS and app vulnerabilities; use base images from trusted registry and keep updated.

### 2. OWASP and API security

- [ ] Review OWASP Top 10 and API Security Top 10: auth (JWT, refresh, logout), injection (parameterized queries, validation), broken access control (RBAC and resource checks), sensitive data exposure (no secrets in logs/responses). Address findings.
- [ ] Ensure HTTPS only; secure headers (CSP, HSTS, etc.); no verbose errors to client.

### 3. Penetration testing

- [ ] Schedule or perform internal pen test: auth bypass, privilege escalation, IDOR, mass assignment. Use automated tools (e.g. ZAP) and manual checks; document findings and remediate.
- [ ] Optional: external pen test by third party; treat report as backlog and fix critical items.

### 4. Verify

- [ ] No critical/high open in scan; pen test findings triaged and critical fixed. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 29 is complete. Next: [Day 30](day-30.md) (Documentation finalization and team handoff).
