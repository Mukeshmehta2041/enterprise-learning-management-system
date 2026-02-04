# Day 26 – Chaos engineering and resilience drills

**Focus:** Controlled failure injection; validate circuit breakers, retries, and DLQ; runbooks and game days.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 26 is done_

---

## Checklist

### 1. Failure scenarios

- [ ] Document and test: dependency down (User Service unreachable from Auth), DB timeout, Redis down, Kafka broker down, high latency from downstream. Prefer staging or dedicated chaos env.
- [ ] Use Chaos Mesh, Litmus, or manual kill/network delay to simulate; never run uncontrolled chaos in prod without approval.

### 2. Validation

- [ ] For each scenario: confirm circuit breaker opens after threshold; retries exhaust and return fallback or 503; no cascade failure (e.g. thread pool exhaustion). Kafka consumer: messages go to DLQ after retries; idempotent replay succeeds.
- [ ] Verify alerts fire and runbook steps are correct; fix any gaps.

### 3. Game day

- [ ] Schedule game day: inject one failure (e.g. kill one service), let team respond using runbooks, verify recovery and communication. Capture lessons and update runbooks and alerts.
- [ ] Document what is in scope for chaos (staging only vs planned prod drill) and who approves.

### 4. Verify

- [ ] At least two failure scenarios run and validated; game day completed or scheduled. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 26 is complete. Next: [Day 27](day-27.md) (Usage metering and cost visibility).
