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

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Security review**: Review auth, authorization, and input validation for media/course endpoints and document findings.
- [ ] **Rate limiting**: Ensure rate limiting is in place for sensitive endpoints (upload initiation, playback token issuance).
- [ ] **Load test scenarios**: Design and execute load tests for concurrent uploads and high-volume playback operations.
- [ ] **Bottleneck analysis**: Capture key metrics (CPU, memory, DB queries, storage I/O) and identify bottlenecks or limits.

### Frontend

- [ ] **Security-sensitive UI checks**: Confirm that the frontend does not leak sensitive information in URLs, logs, or error messages.
- [ ] **Graceful degradation**: Check how the UI behaves under degraded backend performance or temporary rate limiting.
- [ ] **Bug triage**: Capture and triage any security or performance issues discovered during testing.

### Mobile

- [ ] **Mobile-specific security review**: Verify secure storage and handling of tokens and sensitive identifiers in the mobile app.
- [ ] **Load/latency UX**: Evaluate user experience on mobile under slower backends or high error rates and refine messaging/timeouts.
- [ ] **Issue tracking**: Log and track mobile-specific issues found during these tests.

---

## Done?

When all checklists above are done, Course Day 19 is complete. Next: [Course Day 20 – UX polish, docs, and handover](course-day-20-ux-polish-docs-and-handover.md).

