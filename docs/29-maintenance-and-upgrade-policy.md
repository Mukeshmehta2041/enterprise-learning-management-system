# Maintenance & Upgrade Policy

## Overview
To ensure the security, performance, and reliability of the LMS, we adhere to a proactive maintenance and upgrade schedule for all system components.

## 1. Dependency Management

### Version Pinning
- **Maven/Java:** All dependencies must have explicit versions pinned in the root `pom.xml` using properties.
- **Docker:** Use version-specific tags (e.g., `oepnjdk:17-alpine`) instead of `latest`.

### Automated Scans
- **OWASP Dependency Check:** Integrated into the CI pipeline to block builds containing critical CVEs.
- **Renovate/Dependabot:** Automated PRs for minor and patch version updates.

## 2. Upgrade Cadence

### Application Stack (Monthly)
- **Spring Boot / Cloud:** Monthly check for patch releases; quarterly check for minor releases.
- **Java:** Follow LTS (Long Term Support) versions (Current: Java 21).

### Infrastructure Stack (Quarterly)
- **Kubernetes:** Upgrade one minor version every 3-4 months (following AWS EKS / Google GKE support windows).
- **PostgreSQL / Redis:** Minor patch updates quarterly. Major version upgrades annually after verification in staging.
- **Kafka:** Binary upgrades every 6 months to leverage new protocol features and performance improvements.

## 3. Standard Upgrade Procedure
1. **Research:** Review release notes and breaking changes.
2. **Local Test:** Upgrade versions locally and run the full test suite (`mvn clean test`).
3. **Staging:** Deploy to the staging environment and run performance benchmarks.
4. **Production (Blue-Green):** Deploy using a Blue-Green strategy to allow immediate rollback.
5. **Post-Upgrade:** Monitor error rates and latency for 24 hours.

## 4. Rollback Plan
- **Application:** Revert the Git commit and trigger the CD pipeline.
- **Database:** For minor updates, no rollback. For major updates, restore from the snapshot taken immediately before the upgrade.
- **Kafka:** Kafka is typically upgraded in a rolling fashion; if a version is unstable, the old broker version is re-installed one by one.

## 5. Security Patching (Out-of-Band)
Critical security patches (e.g., Log4Shell severity) must be applied and deployed to production within **24 hours** of availability.
