# LMS Go-Live Playbook

This document outlines the steps for a successful production deployment (Go-Live) and the criteria for rollback.

## 1. Pre-Flight Checklist (T-Minus 24h)
- [ ] **Infrastructure**: Staging smoke tests passed using `k6`.
- [ ] **Security**: No secrets hardcoded in `application.yml`; all injected via env vars.
- [ ] **Backups**: Verified that `backup-db.sh` runs successfully.
- [ ] **Capacity**: Connection pool limits (HikariCP) and Redis memory limits reviewed.
- [ ] **Monitoring**: Prometheus and Grafana dashboards are active; alert rules configured.

## 2. Cutover Steps (The Rollout)
1. **Notify Stakeholders**: Communicate maintenance window (if any).
2. **Database Migration**: Run Flyway migrations first.
   - Verify `schema_version` table after migration.
3. **Deploy Infrastructure**: Ensure Redis and Kafka are scaled to prod specs.
4. **Deploy Services**: Rollout images using rolling updates (e.g., Kubernetes `RollingUpdate` strategy).
   - Order: Common -> Auth -> User -> Course -> Enrollment -> Other services -> Gateway.
5. **Post-Deploy Smoke Test**: Run `STAGING_URL=https://api.lms.com k6 run tests/load/smoke-test.js`.

## 3. Rollback Criteria
Initiate rollback if:
- [ ] Gateway returns >5% errors (5xx) for more than 2 minutes.
- [ ] Critical path failure: Login or Course Catalog returning 500s.
- [ ] Database locking or high CPU (>90%) on PostgreSQL.
- [ ] Kafka consumer lag growing uncontrollably for core topics.

## 4. Rollback Procedure
1. Revert Docker image tags to the previous stable version.
2. If DB migrations are backwards-incompatible, restore DB from previous night's backup (last resort).
3. Clear Redis cache to ensure no stale/corrupt data remains.

## 5. Post-Launch Verification (Launch + 2h)
- [ ] Check logs for `AUDIT_EVENT` entries.
- [ ] Monitor p95 latency in Grafana; compare with load test baselines.
- [ ] Verify that external clients (Frontend/Mobile) can connect without CORS issues.
