# Compliance & Security Controls

## Overview
To achieve industry standard certifications (e.g., SOC 2 Type II, ISO 27001), the LMS implements a series of technical and organizational controls. This document maps our system architecture to common compliance requirements.

## 1. Access Control (Logical Security)
- **Principle of Least Privilege:** Users and services are granted only the permissions necessary for their function.
- **RBAC (Role-Based Access Control):** Enforced at the API level via `lms-common` security filters.
- **MFA (Multi-Factor Authentication):** Required for all administrative access (Admin UI, Cloud Console, Kubernetes access).
- **Access Reviews:** Automated quarterly review of user roles and permissions.

## 2. Data Protection (Encryption & Residency)
- **Encryption in Transit:** All communication is secured via TLS 1.3 (provided by API Gateway and Load Balancers).
- **Encryption at Rest:** All databases (PostgreSQL, Redis) and storage (S3) use AES-256 encryption.
- **PII Protection:** Strict data isolation and GDPR-compliant deletion (Day 21).
- **Secrets Management:** Sensitive keys and tokens are stored in a secure vault (e.g., HashiCorp Vault or AWS Secrets Manager), never in code or config.

## 3. Availability & Business Continuity
- **Redundancy:** All services run in at least 3 replicas across multiple availability zones.
- **Disaster Recovery:** Active-Passive DR strategy with RPO < 15 min and RTO < 4 hours (Day 31).
- **Backups:** Daily encrypted backups with proven restoration procedures.

## 4. Change Management & Audit
- **Audit Trails:** All administrative actions and critical business events are logged to an immutable audit store (Day 25).
- **Infrastructure as Code (IaC):** All environment changes are made via Git (Terraform/K8s manifests), requiring Peer Review (Pull Requests).
- **Vulnerability Scanning:** Automated SAST (Static Analysis) and DAST (Dynamic Analysis) integrated into CI/CD.

## 5. Incident Response
- **Alerting:** Real-time monitoring for security anomalies (Day 41).
- **Runbooks:** Documented procedures for responding to data breaches or service outages.
- **Post-Mortems:** Mandatory documentation for every P1 incident to identify root causes and preventive measures.

## 6. Evidence Collection (Auditor Portal)
The following evidence is automatically collected and stored for audit reviews:
- CI/CD build logs and PR approvals.
- Daily backup verification results.
- Monthly vulnerability scan reports.
- Quarterly access review logs.
