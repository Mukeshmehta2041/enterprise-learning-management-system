# LMS Operations Runbook: Common Tasks

## 1. User Management
### Search for a User by Email
```bash
# Via Admin API (requires token with ADMIN role)
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "X-Roles: ADMIN" \
     "https://api.lms.com/api/v1/admin/users/search?email=user@example.com"
```

### Suspend a User
```bash
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "X-Roles: ADMIN" \
     "https://api.lms.com/api/v1/admin/users/$USER_ID/status?status=SUSPENDED"
```

## 2. Course Moderation
### Take Down a Course (Suspended status)
```bash
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
     -H "X-Roles: ADMIN" \
     "https://api.lms.com/api/v1/admin/courses/$COURSE_ID/status?status=SUSPENDED"
```

## 3. Cache Management
### Invalidate Cache for a Specific Course
```bash
# Requires direct access to Redis or through an internal tool
redis-cli -h $REDIS_HOST DEL "course-cache::courses::$COURSE_ID"
```

## 4. Scaling
### Scale a Service (Kubernetes)
```bash
kubectl scale deployment lms-course-service --replicas=5 -n lms-prod
```

## 5. Event Replay
### Check Kafka Consumer Lag (e.g. for Search Service)
```bash
kafka-consumer-groups --bootstrap-server $KAFKA_HOST --describe --group lms-search-group
```

## 6. Rotation
### Rotate JWT Secret
1. Update `JWT_SECRET` in Secret Manager / Vault.
2. Restart Auth service and Gateway.
3. Note: All current sessions will be invalidated.
