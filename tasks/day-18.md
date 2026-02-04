# Day 18 – Feature flags and configuration management

**Focus:** Feature flags for gradual rollout and A/B; externalized configuration; minimal downtime config changes.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 18 is done_

---

## Checklist

### 1. Feature flags

- [ ] Introduce feature flag mechanism: in-memory (config file) or external (e.g. LaunchDarkly, Config Server, Redis). Flags control: new API version, new enrollment flow, payment gateway switch, etc.
- [ ] Services read flags at startup or with short TTL; no app restart required for flag flip where possible. Document how to add and toggle flags.

### 2. Configuration externalization

- [ ] All environment-specific config (URLs, feature flags, limits) in config server or env vars; no hardcoded prod URLs in code. Use Spring Cloud Config or 12-factor style.
- [ ] Sensitive values only from secrets store; list all required keys in README or ops doc.

### 3. Safe changes

- [ ] Use flags to hide incomplete features; enable after verification. For breaking changes, support old and new behaviour behind flag and deprecate old path.
- [ ] Document process: add flag → deploy → enable for % or cohort → full rollout → remove flag.

### 4. Verify

- [ ] Toggle a flag and confirm behaviour change without deploy; config refresh works where implemented. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 18 is complete. Next: [Day 19](day-19.md) (Admin APIs and operational tooling).
