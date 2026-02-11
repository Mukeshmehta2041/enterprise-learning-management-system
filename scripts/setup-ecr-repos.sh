#!/usr/bin/env bash
# Create ECR repositories for all LMS services
# Usage: ./setup-ecr-repos.sh [aws_region]
# Requires: AWS CLI configured with credentials that can create ECR repos

set -euo pipefail

REGION="${1:-us-east-1}"
REPOS=(
  "lms-gateway"
  "lms-auth-service"
  "lms-user-service"
  "lms-course-service"
  "lms-enrollment-service"
  "lms-content-service"
  "lms-assignment-service"
  "lms-search-service"
  "lms-notification-service"
  "lms-payment-service"
  "lms-analytics-service"
)

echo "Creating ECR repositories in region $REGION..."
for repo in "${REPOS[@]}"; do
  if aws ecr describe-repositories --repository-names "$repo" --region "$REGION" 2>/dev/null; then
    echo "  $repo already exists"
  else
    aws ecr create-repository --repository-name "$repo" --region "$REGION"
    echo "  Created $repo"
  fi
done
echo "Done."
