#!/bin/bash
# LMS Database Backup Script
# This script performs a pg_dump of the 'lms' database.

BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/lms_backup_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

echo "Starting backup for 'lms' database at ${TIMESTAMP}..."

# Perform backup using pg_dump
# Assumes environment variables PGHOST, PGUSER, PGPASSWORD are set
pg_dump -d lms | gzip > "${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup successful: ${BACKUP_FILE}"
else
    echo "Backup failed!"
    exit 1
fi

# Retention: Remove backups older than 30 days
echo "Cleaning up backups older than 30 days..."
find "${BACKUP_DIR}" -name "lms_backup_*.sql.gz" -mtime +30 -exec rm {} \;

echo "Backup process completed."
