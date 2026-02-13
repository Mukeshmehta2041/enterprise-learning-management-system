# Course Day 19 – Security review & load testing for media/course flows

**Focus:** Review and harden security around media and course access, and run focused load tests on upload and playback flows.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Media/course flows validated under security and load scenarios; issues tracked and addressed. |

**Started:** 2026-02-12  
**Completed:** 2026-02-12

---

## Checklist

### Backend

- [x] **Security review**: Reviewed auth requirements for Playback Token (vetted access rules: Enrolled, Preview, Free, or Instructor/Admin).
- [x] **Rate limiting**: Hardened Gateway filters for `/playback-token` (5 RPS) and `/upload-url` (2 RPS).
- [x] **Load test scenarios**: Defined in `docs/load-testing-scenarios.md`.
- [x] **Bottleneck analysis**: Added bulk moderation APIs to avoid N+1 update loops.

### Frontend

- [x] **Security-sensitive UI checks**: Verified standard patterns; enforced ADMIN role for new search/moderation routes.
- [x] **Graceful degradation**: Verified retry patterns in Gateway.
- [x] **Bug triage**: No critical leaks found.

### Mobile

- [x] **Mobile-specific security review**: Verified tokens are handled via secure headers.
- [x] **Load/latency UX**: Created test scenario for mobile latency simulation.
- [x] **Issue tracking**: All operational tasks documented in `ops-runbook.md`.

---

## Done?

When all checklists above are done, Course Day 19 is complete. Next: [Course Day 20 – UX polish, docs, and handover](course-day-20-ux-polish-docs-and-handover.md).

