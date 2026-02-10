# Cost Optimization & Rightsizing

## Overview
Efficient resource management is critical for the long-term sustainability of the LMS. This document outlines our strategy for rightsizing infrastructure, leveraging discounted pricing models, and maintaining cost visibility.

## 1. Rightsizing Strategy

### Microservices (Kubernetes)
- **Baseline Monitoring:** Use Prometheus metrics (e.g., `container_cpu_usage_seconds_total`) to analyze the gap between `requests` and actual usage.
- **Target Utilization:** Aim for 60-80% average CPU/Memory utilization.
- **VPA (Vertical Pod Autoscaler):** Enable VPA in "Recommendation" mode to identify optimal resource limits for each service.
- **HPA (Horizontal Pod Autoscaler):** Scale by number of pods based on traffic rather than over-provisioning single large pods.

### Database (PostgreSQL)
- **Connection Pooling:** Monitor HikariCP metrics. If `active_connections` is consistently low, reduce `maximum-pool-size` to save memory.
- **Instance Sizing:** If CPU is consistently below 20%, downsize the DB instance. Use IOPS-optimized storage only where necessary (e.g., Analytics).

## 2. Discounted Pricing Models

### Reserved Instances (RI) / Savings Plans
- **Baseline Workload:** Buy 1-year or 3-year Reserved Instances for the production Database, Redis cluster, and the minimum number of nodes in the EKS/GKE cluster.
- **Expected Savings:** 30-50% compared to On-Demand pricing.

### Spot Instances
- **Batch Workers:** Use Spot instances for the `lms-analytics-service` batch jobs and non-critical notification workers.
- **Staging/Dev:** Use 100% Spot instances for non-production environments with a fallback to On-Demand.

## 3. Storage Optimization
- **Logs:** Retention policy of 7 days in fast storage (ELK), archived to S3 Glacier for long-term compliance.
- **Backups:** Daily snapshots kept for 30 days. Weekly backups kept for 1 year.
- **Kafka:** Retention set to 24 hours for most topics; 7 days for critical event logs.

## 4. Cost Visibility & Alerting
- **Tagging:** All cloud resources must have `Service`, `Environment`, and `CostCenter` tags.
- **Billing Alerts:** Threshold-based alerts (e.g., "Monthly cost exceeded $1,000") and anomaly alerts (e.g., "Daily cost increased by >20%").
- **Cost Dashboard:** A Grafana dashboard showing cost per microservice based on Cloud Spend exports.
