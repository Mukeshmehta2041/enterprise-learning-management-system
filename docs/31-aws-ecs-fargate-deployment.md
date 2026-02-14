# 31. AWS ECS Fargate Deployment Guide

This guide provides a comprehensive, step-by-step process to deploy the LMS microservices to AWS Elastic Container Service (ECS) using Fargate (serverless compute).

## 1. Architecture Overview

In this deployment model:
- **ECS Cluster**: A logical grouping of services.
- **ECS Services**: Maintains the desired number of instances of a Task Definition.
- **Task Definitions**: JSON templates describing the container (image, CPU, memory, env vars, logging).
- **Application Load Balancer (ALB)**: Routes external traffic to the API Gateway and potentially directly to services if needed.
- **Fargate**: The serverless infrastructure that runs your containers without requiring you to manage EC2 instances.
- **Cloud Map**: Provides Service Discovery for inter-service communication.

---

## 2. Prerequisites

- **AWS CLI** installed and configured with appropriate permissions (AdministratorAccess recommended for setup).
- **Infrastructure**: A VPC with at least two public and two private subnets across different Availability Zones.
- **Managed Services**:
    - **RDS (PostgreSQL)**: To host service databases.
    - **Amazon MSK (Kafka)** or a self-managed Kafka on EC2.
    - **ElastiCache (Redis)**: For caching and session management.

---

## 3. Step-by-Step Deployment

### Step 1: Prepare Container Images (ECR)

Ensure all services have an ECR repository. Use the existing script:

```bash
./scripts/setup-ecr-repos.sh <your-region>
```

Build and push your images (example for `lms-user-service`):

```bash
# Login to ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com

# Build, tag and push
docker build -t lms-user-service -f services/lms-user-service/Dockerfile .
docker tag lms-user-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/lms-user-service:latest
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/lms-user-service:latest
```

### Step 2: Create IAM Roles

You need two primary roles:
1. **ECS Task Execution Role**: Allows ECS to pull images from ECR and send logs to CloudWatch.
    - Policies: `AmazonECSTaskExecutionRolePolicy`, `CloudWatchLogsFullAccess`.
2. **ECS Task Role**: Allows the application *inside* the container to access AWS services (e.g., S3, SNS).

### Step 3: Create an ECS Cluster

```bash
aws ecs create-cluster --cluster-name lms-production --capacity-providers FARGATE
```

### Step 4: Configure Networking & Load Balancing

1. **Create an ALB**: Place it in **public** subnets.
2. **Target Groups**: Create a Target Group for the `lms-gateway` on port 8080.
3. **Security Groups**:
   - **ALB SG**: Allow port 80/443 from 0.0.0.0/0.
   - **Service SG**: Allow traffic from ALB SG on service ports (e.g., 8080). Allow all internal traffic within the SG for inter-service communication.

### Step 5: Service Discovery (Cloud Map)

Create a private DNS namespace (e.g., `lms.local`) to allow services to find each other:

```bash
aws servicediscovery create-private-dns-namespace --name lms.local --vpc <vpc-id>
```

### Step 6: Define Task Definitions

Create a `task-definition.json` for each service. 
**Important**: Set `networkMode` to `awsvpc`.

Example for `lms-user-service`:
```json
{
  "family": "lms-user-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::<id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "user-service",
      "image": "<aws_account_id>.dkr.ecr.<region>.amazonaws.com/lms-user-service:latest",
      "portMappings": [{ "containerPort": 8080 }],
      "environment": [
        { "name": "SPRING_PROFILES_ACTIVE", "value": "prod" },
        { "name": "SPRING_DATASOURCE_URL", "value": "jdbc:postgresql://<rds-endpoint>:5432/lms_user" },
        { "name": "KAFKA_BOOTSTRAP_SERVERS", "value": "<msk-endpoint>:9092" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lms-user-service",
          "awslogs-region": "<region>",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 7: Create ECS Services

Deploy the gateway first, then other services.

```bash
aws ecs create-service \
  --cluster lms-production \
  --service-name lms-user-service \
  --task-definition lms-user-service \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[<private-subnet-1>,<private-subnet-2>],securityGroups=[<service-sg-id>]}" \
  --service-registries "registryArn=<cloud-map-discovery-arn>"
```

---

## 4. CI/CD Integration (GitHub Actions)

Update `.github/workflows/ci-cd.yml` to include a deployment step for ECS:

1. **Configure AWS Credentials**: Use `aws-actions/configure-aws-credentials`.
2. **Login to ECR**: Use `aws-actions/amazon-ecr-login`.
3. **Build/Push**: (Already exists in current pipeline).
4. **Update ECS Service**:
   ```yaml
   - name: Fill in the new image ID in the Amazon ECS task definition
     id: task-def
     uses: aws-actions/amazon-ecs-render-task-definition@v1
     with:
       task-definition: task-definition.json
       container-name: user-service
       image: ${{ steps.build-image.outputs.image }}

   - name: Deploy Amazon ECS task definition
     uses: aws-actions/amazon-ecs-deploy-task-definition@v1
     with:
       task-definition: ${{ steps.task-def.outputs.task-definition }}
       service: lms-user-service
       cluster: lms-production
       wait-for-service-stability: true
   ```

---

## 5. Best Practices & Operations

- **Auto-scaling**: Configure Service Auto Scaling based on CPU/Memory utilization.
- **Secrets Management**: Use **AWS Secrets Manager** or **Parameter Store** and reference them in the Task Definition instead of plain text environment variables.
- **Health Checks**: Use Spring Boot Actuator `/actuator/health` for both ALB health checks and ECS container health checks.
- **Log Aggregation**: Logs are sent to CloudWatch by default. Consider using **CloudWatch Logs Insights** for querying.
- **Blue-Green Deployments**: Use **AWS CodeDeploy** with ECS for automated blue-green traffic shifting.

---

## 6. Cleanup

To avoid charges when not in use:
1. Set desired count of all services to 0.
2. Delete the ALB.
3. Delete the ECS Cluster.
4. Stop/Delete RDS, MSK, and ElastiCache instances.
