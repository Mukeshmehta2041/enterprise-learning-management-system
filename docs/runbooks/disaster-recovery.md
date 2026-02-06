# LMS Disaster Recovery and Backup Runbook

## 1. Database Backup & Restore (PostgreSQL)

### Automation
- Backups are performed daily via `infra/docker/scripts/backup-db.sh`.
- Retention: 30 days.
- Location: `/backups/postgres` (on-disk or mounted volume).

### Restore Procedure
1. Stop all application services to prevent writes:
   ```bash
   docker-compose stop lms-user-service lms-course-service ...
   ```
2. Identify the backup file to restore.
3. Drop and recreate the database:
   ```bash
   docker exec -it lms-postgres dropdb -U lms lms
   docker exec -it lms-postgres createdb -U lms lms
   ```
4. Restore from the compressed backup:
   ```bash
   gunzip -c /backups/postgres/lms_backup_YYYYMMDD.sql.gz | docker exec -i lms-postgres psql -U lms -d lms
   ```
5. Restart services and verify health.

## 2. Event Persistence (Kafka)

### Configuration
- Retention: 7 days (`KAFKA_LOG_RETENTION_HOURS=168`).
- Size Limit: 1GB per partition (`KAFKA_LOG_RETENTION_BYTES`).
- Persistence: Data is stored in `kafka_data` volume.

### Recovery
- If Kafka message data is lost but the volume is intact, Kafka will rebuild its index on startup.
- If data is completely lost, consumers must be triggered to re-sync state from source systems if possible (Service-level logic).

## 3. Cache Persistence (Redis)

### Configuration
- AOF (Append Only File) is enabled for persistence.
- Mode: `redis-server --appendonly yes`.

### Recovery
- Redis automatically reloads data from the `appendonly.aof` file in the `redis_data` volume on startup.

## 4. Retention Summary

| Data Type | Retention Period | Storage Location |
|-----------|------------------|------------------|
| DB Backups | 30 Days | /backups/postgres |
| App Logs | 14 Days | Centralized Logging (ELK) |
| Audit Logs | 1 Year | DB (`audit_logs` table) + Log Export |
| Kafka Events| 7 Days | Kafka Log Segments |

## 5. Emergency Contacts
- Infrastructure Lead: admin@example.com
- Security Officer: security@example.com
