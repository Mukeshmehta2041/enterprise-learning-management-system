# Mobile Day 40 – Mobile security hardening and secure storage

**Focus:** Harden the mobile app against common security risks, especially around token storage and sensitive data.

**References:** [docs/mobile/05-auth-and-security-mobile.md](../docs/mobile/05-auth-and-security-mobile.md), [docs/07-security.md](../docs/07-security.md), OWASP Mobile Top 10.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile security review and hardening in progress. |
| ✅ Done | Major mobile security concerns identified and mitigated. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 40 is done_

---

## Checklist

### 1. Secure storage

- [ ] Ensure auth tokens and sensitive data are stored using secure storage APIs (Keychain/Keystore or equivalent).
- [ ] Avoid storing secrets or PII in async storage or logs.

### 2. Network security

- [ ] Verify all API calls use HTTPS and respect certificate validation (no debug overrides in prod builds).
- [ ] Consider certificate pinning if required by your threat model.

### 3. App integrity and tampering

- [ ] Review debug-only settings and ensure they are disabled in production builds (e.g. debug menus, logging levels).
- [ ] Consider basic checks for rooted/jailbroken devices if relevant.

### 4. Verification

- [ ] Run a basic mobile security checklist or scanner where feasible.
- [ ] Document findings, mitigations, and follow-ups for future days or sprints.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 40 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 40 is complete. Next: [Mobile Day 41](mobile-day-41.md) (Admin and instructor mobile dashboards).

