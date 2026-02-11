#!/usr/bin/env bash
# Blue-green deployment script for LMS services on Kubernetes
# Usage: ./deploy-blue-green.sh <services_json> <image_tag> <ecr_registry> [namespace]
# Example: ./deploy-blue-green.sh '["lms-user-service"]' abc1234 123456789.dkr.ecr.us-east-1.amazonaws.com lms

set -euo pipefail

SERVICES_JSON="${1:-[]}"
IMAGE_TAG="${2:-latest}"
ECR_REGISTRY="${3:-}"
NAMESPACE="${4:-lms}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
K8S_DIR="$REPO_ROOT/k8s"
BLUE_GREEN_DIR="$K8S_DIR/blue-green"

# Service name to file prefix: lms-user-service -> user-service
get_file_prefix() {
  echo "${1#lms-}"
}

# Get current active color from Service selector
get_active_color() {
  local svc=$1
  kubectl get svc "$svc" -n "$NAMESPACE" -o jsonpath='{.spec.selector.version}' 2>/dev/null || echo "blue"
}

# Get inactive color
get_inactive_color() {
  local active=$1
  if [ "$active" = "blue" ]; then echo "green"; else echo "blue"; fi
}

# Deploy service with blue-green strategy
deploy_service() {
  local svc=$1
  local prefix
  prefix=$(get_file_prefix "$svc")
  local full_image
  if [ -n "$ECR_REGISTRY" ]; then
    full_image="${ECR_REGISTRY}/lms-${svc}:${IMAGE_TAG}"
  else
    full_image="lms-${svc}:${IMAGE_TAG}"
  fi

  echo "==> Deploying $svc with image $full_image"
  local active_color
  active_color=$(get_active_color "lms-${svc}")
  local inactive_color
  inactive_color=$(get_inactive_color "$active_color")

  # Check if blue-green manifests exist (files use prefix: user-service, auth-service, gateway, etc.)
  local blue_file="$BLUE_GREEN_DIR/${prefix}-blue.yaml"
  local green_file="$BLUE_GREEN_DIR/${prefix}-green.yaml"
  local svc_file="$BLUE_GREEN_DIR/${prefix}-svc.yaml"

  if [ ! -f "$blue_file" ] || [ ! -f "$green_file" ]; then
    echo "    Blue-green manifests not found for $svc ($prefix), skipping"
    return 0
  fi

  # Update image in the inactive deployment
  local deploy_file="${BLUE_GREEN_DIR}/${prefix}-${inactive_color}.yaml"
  if [ ! -f "$deploy_file" ]; then
    echo "    Deployment file $deploy_file not found, skipping"
    return 0
  fi

  # Ensure Service exists (for first-time deploy)
  if [ -f "$svc_file" ]; then
    kubectl apply -f "$svc_file" -n "$NAMESPACE"
  fi

  # Apply the inactive deployment with image override
  sed "s|image:.*|image: $full_image|" "$deploy_file" | kubectl apply -f - -n "$NAMESPACE"

  # Wait for rollout (svc is already full name e.g. lms-user-service)
  local deploy_name="${svc}-${inactive_color}"
  if kubectl rollout status "deployment/$deploy_name" -n "$NAMESPACE" --timeout=300s 2>/dev/null; then
    # Patch Service to switch traffic to inactive (new) color
    kubectl patch svc "lms-${svc}" -n "$NAMESPACE" -p "{\"spec\":{\"selector\":{\"app\":\"lms-${svc}\",\"version\":\"${inactive_color}\"}}}"
    echo "    Traffic switched to $inactive_color"
  else
    echo "    Rollout failed for $deploy_name"
    return 1
  fi
}

# Main
echo "Blue-green deploy: services=$SERVICES_JSON image_tag=$IMAGE_TAG ecr=$ECR_REGISTRY namespace=$NAMESPACE"

# Ensure namespace and base config exist
if [ -f "$K8S_DIR/00-base.yaml" ]; then
  kubectl apply -f "$K8S_DIR/00-base.yaml"
fi

# Parse services and deploy each
if [ "$SERVICES_JSON" = "[]" ] || [ -z "$SERVICES_JSON" ]; then
  echo "No services to deploy"
  exit 0
fi

# Use jq to parse JSON array, fallback to manual
if command -v jq &>/dev/null; then
  for svc in $(echo "$SERVICES_JSON" | jq -r '.[]'); do
    deploy_service "$svc"
  done
else
  echo "jq required for parsing services JSON"
  exit 1
fi

echo "Blue-green deployment complete"
