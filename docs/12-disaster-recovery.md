# Disaster Recovery and Multi-Region Design

This document outlines the Disaster Recovery (DR) strategy and Multi-Region architecture for the LMS.

## 1. Objectives

- **RTO (Recovery Time Objective)**: < 1 hour (Target for manual failover and validation).
- **RPO (Recovery Point Objective)**: < 5 minutes (Maximum data loss allowed during failover).
- **Strategy**: Active-Passive (Primary in Region A, Secondary in Region B on standby).

## 2. Component Replication

### 2.1. PostgreSQL (Transactional Data)
- **Primary**: Region A (Lead).
- **Secondary**: Region B (Read Replica / Standby).
- **Mechanism**: Use managed streaming replication (e.g., AWS RDS Cross-Region Read Replica or GCP Cloud SQL Cross-Region Replica).
- **Promotion**: Manual promotion to Lead during DR declaration.

### 2.2. Kafka (Event Stream)
- **Tool**: MirrorMaker 2 (MM2).
- **Primary**: Region A Cluster.
- **Secondary**: Region B Cluster.
- **Configuration**: MM2 replicates topics from A to B. Offset sync is enabled to allow consumer group migration with minimum duplication.
- **Failover**: Services in Region B connect to the local Kafka cluster.

### 2.3. Redis (Cache and Session)
- **Primary**: Region A.
- **Secondary**: Region B.
- **Note**: Refresh tokens are stored in Redis. These are critical for security.
- **Replication**: Redis Global Datastore or manual cross-region replication.
- **Alternative**: If RPO allows, discard cache on failover but force user re-login if refresh tokens are lost. For LMS, we target replication of the `auth` Redis keys.

### 2.4. S3 / Object Storage (Content)
- **Mechanism**: Cross-Region Replication (CRR).
- **Policy**: Versions and metadata replicated asynchronously.

## 3. Traffic Management

- **Global Load Balancer / DNS**: Cloudflare, Route53, or Google Cloud Load Balancing.
- **Health Check**: Monitor the Gateway health endpoint in Region A.
- **Switch**: Update DNS CNAME or Global LB backend to point to Region B Ingress.

## 4. Failover Runbook

### Step 1: Declaration
- **Trigger**: Region A is down or degraded significantly (>15 mins).
- **Decision**: CTO or Ops Lead declares DR.

### Step 2: Database Promotion
1. Promote Region B PostgreSQL replica to Standalone/Lead.
2. Verify connectivity and schema integrity.

### Step 3: Kafka and Redis
1. Stop MirrorMaker 2 if still running.
2. Verify Region B Kafka topics have replicated the latest messages.

### Step 4: Infrastructure Scaler
1. Scale up Kubernetes deployments in Region B (Warm Standby -> Full Capacity).
2. Verify all liveness/readiness probes are passing.

### Step 5: Traffic Switch
1. Update DNS records to Region B Load Balancer.
2. Purge Global CDN cache if needed.

### Step 6: Post-failover Verification
1. Verify user login (Auth Service).
2. Verify course enrollment and content access.
3. Check Error Logs for replication lag issues.

## 5. Recovery (Failback)

1. Re-establish Region A as a replica of Region B.
2. Wait for replication lag to reach near-zero.
3. Schedule maintenance window.
4. Reverse the traffic switch.
