#!/usr/bin/env bash
# Cleanup ECS test infrastructure to stop all costs
# Usage: ./cleanup-ecs.sh [aws_region]

set -euo pipefail

REGION="${1:-us-east-1}"
CLUSTER_NAME="lms-production"
SERVICE_NAME="lms-user-service"

echo "Cleaning up ECS resources in $REGION to stop costs..."

# 1. Scale service to 0
echo "  Scaling service to 0..."
aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --desired-count 0 --region "$REGION" || echo "  Service not found or already stopped."

# 2. Delete the service
echo "  Deleting service..."
aws ecs delete-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --force --region "$REGION" || echo "  Service not found."

# 3. Delete the cluster (optional, but saves small amounts of metadata clutter)
echo "  Deleting cluster..."
aws ecs delete-cluster --cluster "$CLUSTER_NAME" --region "$REGION" || echo "  Cluster not found."

# 4. Note about ECR and Logs
echo ""
echo "Note: ECR repositories and CloudWatch logs were NOT deleted."
echo "To delete logs: aws logs delete-log-group --log-group-name /ecs/lms-user-service --region $REGION"
echo "To delete images: aws ecr delete-repository --repository-name lms-user-service --force --region $REGION"
echo "IAM roles were kept as they are free."
echo "Cleanup complete!"
