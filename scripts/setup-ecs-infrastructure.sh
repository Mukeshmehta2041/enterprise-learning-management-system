#!/usr/bin/env bash
# Setup basic ECS Fargate infrastructure (Cluster, IAM Roles, Cloud Map)
# Usage: ./setup-ecs-infrastructure.sh [aws_region]

set -euo pipefail

REGION="${1:-us-east-1}"
CLUSTER_NAME="lms-production"
NAMESPACE="lms.local"

echo "Setting up ECS infrastructure in region $REGION..."

# 1. Create ECS Cluster
if aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$REGION" | grep -q "ACTIVE"; then
  echo "  Cluster $CLUSTER_NAME already exists"
else
  aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region "$REGION" --capacity-providers FARGATE
  echo "  Created ECS Cluster: $CLUSTER_NAME"
fi

# 2. Create IAM Roles (Task Execution Role)
ROLE_NAME="ecsTaskExecutionRole"
if aws iam get-role --role-name "$ROLE_NAME" 2>/dev/null; then
  echo "  Role $ROLE_NAME already exists"
else
  echo "  Creating $ROLE_NAME..."
  cat > ecs-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ecs-tasks.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document file://ecs-trust-policy.json
  aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
  aws iam attach-role-policy --role-name "$ROLE_NAME" --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess
  rm ecs-trust-policy.json
fi

# 3. Create IAM Roles (Task Role)
TASK_ROLE_NAME="ecsTaskRole"
if aws iam get-role --role-name "$TASK_ROLE_NAME" 2>/dev/null; then
  echo "  Role $TASK_ROLE_NAME already exists"
else
  echo "  Creating $TASK_ROLE_NAME..."
  cat > ecs-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ecs-tasks.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
  aws iam create-role --role-name "$TASK_ROLE_NAME" --assume-role-policy-document file://ecs-trust-policy.json
  # Add specific policies here if the task needs access to S3, SNS etc.
  rm ecs-trust-policy.json
fi

# 4. Create Cloud Map Namespace (Service Discovery)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region "$REGION")
if [ "$VPC_ID" == "None" ] || [ -z "$VPC_ID" ]; then
  VPC_ID=$(aws ec2 describe-vpcs --query "Vpcs[0].VpcId" --output text --region "$REGION")
fi

if aws servicediscovery list-namespaces --region "$REGION" | grep -q "$NAMESPACE"; then
  echo "  Namespace $NAMESPACE already exists"
else
  echo "  Creating Cloud Map namespace $NAMESPACE in VPC $VPC_ID..."
  aws servicediscovery create-private-dns-namespace --name "$NAMESPACE" --vpc "$VPC_ID" --region "$REGION"
fi

# 5. Create CloudWatch Log Groups with 1-day retention (Cost Saving)
for svc in "lms-user-service" "lms-gateway"; do
  LOG_GROUP="/ecs/$svc"
  if aws logs describe-log-groups --log-group-name-prefix "$LOG_GROUP" --region "$REGION" | grep -q "$LOG_GROUP"; then
    echo "  Log group $LOG_GROUP already exists"
  else
    aws logs create-log-group --log-group-name "$LOG_GROUP" --region "$REGION"
    aws logs put-retention-policy --log-group-name "$LOG_GROUP" --retention-in-days 1 --region "$REGION"
    echo "  Created log group $LOG_GROUP with 1-day retention"
  fi
done

# 6. Create Security Group for the Service
SG_NAME="lms-service-sg"
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" --query "SecurityGroups[0].GroupId" --output text --region "$REGION" 2>/dev/null || echo "None")

if [ "$SG_ID" == "None" ] || [ "$SG_ID" == "" ]; then
  echo "  Creating security group $SG_NAME..."
  SG_ID=$(aws ec2 create-security-group --group-name "$SG_NAME" --description "Security group for LMS microservices" --vpc-id "$VPC_ID" --query "GroupId" --output text --region "$REGION")
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 8081 --cidr 0.0.0.0/0 --region "$REGION"
  aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port 8080 --cidr 0.0.0.0/0 --region "$REGION"
  echo "  Created SG: $SG_ID (Allowed 8080, 8081)"
else
  echo "  Security group $SG_NAME already exists ($SG_ID)"
fi

echo "Infrastructure setup complete!"

# Get Subnets for CLI command
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region "$REGION" | tr '\t' ',')

echo ""
echo "Next Steps:"
echo "1. Push the Docker image to ECR (already handled by CI/CD if main branch is pushed)."
echo "2. Create the ECS Services using these commands (once the CI/CD build is finished):"
echo ""
echo "--- LMS USER SERVICE ---"
echo "aws ecs create-service \\"
echo "  --cluster $CLUSTER_NAME \\"
echo "  --service-name lms-user-service \\"
echo "  --task-definition lms-user-service \\"
echo "  --desired-count 1 \\"
echo "  --capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1 \\"
echo "  --network-configuration \"awsvpcConfiguration={subnets=[$SUBNETS],assignPublicIp=ENABLED,securityGroups=[$SG_ID]}\" \\"
echo "  --region $REGION"
echo ""
echo "--- LMS GATEWAY ---"
echo "aws ecs create-service \\"
echo "  --cluster $CLUSTER_NAME \\"
echo "  --service-name lms-gateway \\"
echo "  --task-definition lms-gateway \\"
echo "  --desired-count 1 \\"
echo "  --capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1 \\"
echo "  --network-configuration \"awsvpcConfiguration={subnets=[$SUBNETS],assignPublicIp=ENABLED,securityGroups=[$SG_ID]}\" \\"
echo "  --region $REGION"
echo ""
echo "COST SAVING TIPS:"
echo "1. We used FARGATE_SPOT (cheapest option)."
echo "2. Log retention is set to 1 day."
echo "3. Run this to stop costs when not testing:"
echo "   aws ecs update-service --cluster $CLUSTER_NAME --service lms-user-service --desired-count 0 --region $REGION"
echo "4. Use ./scripts/cleanup-ecs.sh for full removal."
echo ""
echo "Note: Make sure to create a Security Group that allows port 8081 and set its ID above."
