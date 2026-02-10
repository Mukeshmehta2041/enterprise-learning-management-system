# Day 44 – Compliance and certification prep

**Focus:** Prepare for SOC 2, ISO 27001, or similar: evidence collection, control mapping, and documentation for security and availability.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/08-observability.md](../docs/08-observability.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Mapped security controls to system capabilities and defined evidence collection procedures. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Control mapping

- [x] Map controls (e.g. access control, encryption, logging, change management, incident response) to system capabilities: RBAC, TLS, audit logs, CI/CD, runbooks. Identify gaps and document remediation or compensating controls.
- [x] Document where evidence lives: access reviews, backup logs, penetration test report, incident log.

### 2. Evidence and documentation

- [x] Collect or automate evidence: access logs, change history (Git), deployment logs, backup verification, vulnerability scan results. Store in secure, auditable location; retention per certification requirement.
- [x] Policy docs: security policy, incident response, backup and DR, acceptable use; review and version.

### 3. Gaps and remediation

- [x] Prioritize gaps (e.g. MFA for admin, encryption at rest, log retention); create tickets and target dates. Document accepted risks and exceptions with approval.
- [x] Schedule internal or external audit prep; rehearse evidence presentation.

### 4. Verify

- [x] Control matrix and evidence index complete; at least one full evidence pull for a control. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 44 is complete. Next: [Day 45](day-45.md) (Event replay and audit trail query).
