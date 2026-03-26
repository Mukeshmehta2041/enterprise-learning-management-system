import os
import json

infra_components = [
    ("postgres", "postgres:15-alpine", 5432, [
        {"name": "POSTGRES_DB", "value": "lms"},
        {"name": "POSTGRES_USER", "value": "lms"},
        {"name": "POSTGRES_PASSWORD", "value": "lms_password"}
    ]),
    ("redis", "redis:7-alpine", 6379, []),
    ("kafka", "redpandadata/redpanda:latest", 9092, [
        {"name": "REDPANDA_AUTO_CONFIG", "value": "true"}
    ]),
    ("elastic", "elasticsearch:7.17.10", 9200, [
        {"name": "discovery.type", "value": "single-node"}
    ])
]

base_dir = "/Users/mukeshkumar/Developer/projects/spring-boot/learning-managment-system"
workflows_dir = os.path.join(base_dir, ".github/workflows")
aws_dir = os.path.join(base_dir, ".aws")

for name, image, port, env in infra_components:
    task_def = {
      "family": f"lms-{name}-task",
      "networkMode": "awsvpc",
      "requiresCompatibilities": ["FARGATE"],
      "cpu": "1024" if name in ["elastic", "kafka"] else "256",
      "memory": "2048" if name in ["elastic", "kafka"] else "512",
      "executionRoleArn": "arn:aws:iam::448100672347:role/ecsTaskExecutionRole",
      "containerDefinitions": [
        {
          "name": f"lms-{name}-service",
          "image": image,
          "essential": True,
          "portMappings": [
            {"containerPort": port, "hostPort": port, "protocol": "tcp"}
          ],
          "environment": env,
          "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
              "awslogs-group": f"/ecs/lms-{name}-service",
              "awslogs-region": "us-east-1",
              "awslogs-stream-prefix": "ecs",
              "awslogs-create-group": "true"
            }
          }
        }
      ]
    }
    
    # Write JSON task def
    json_path = os.path.join(aws_dir, f"ecs-task-def-{name}.json")
    with open(json_path, "w") as f:
        json.dump(task_def, f, indent=2)

workflow_template = """name: Deploy LMS Infrastructure (DB, Redis, Kafka, Elastic)

on:
  workflow_dispatch: # Manual trigger to spin up / spin down databases

env:
  AWS_REGION: us-east-1                  
  ECS_CLUSTER: lms-fargate-cluster    
  NAMESPACE: lms.internal

jobs:
  deploy_infra:
    name: Deploy Infrastructure
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Initialize AWS Cloud Map (Service Discovery)
        run: |
          NS_ID=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='${{ env.NAMESPACE }}'].Id" --output text 2>/dev/null)
          if [ -z "$NS_ID" ] || [ "$NS_ID" == "None" ]; then
            VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region ${{ env.AWS_REGION }} --query 'Vpcs[0].VpcId' --output text)
            aws servicediscovery create-private-dns-namespace --name ${{ env.NAMESPACE }} --vpc $VPC_ID
            echo "Waiting for namespace creation..."
            sleep 30
          fi

"""

def append_service_step(name, port):
    return f"""
      - name: Deploy {name.upper()} 
        run: |
          ECS_SERVICE="lms-{name}-service"
          CONTAINER_NAME="lms-{name}-service"
          TASK_DEF=".aws/ecs-task-def-{name}.json"
          
          # Replace Account ID
          sed -i 's/448100672347/${{{{ secrets.AWS_ACCOUNT_ID }}}}/g' $TASK_DEF
          
          # Log group
          LOG_GROUP="/ecs/$CONTAINER_NAME"
          aws logs create-log-group --log-group-name $LOG_GROUP --region ${{{{ env.AWS_REGION }}}} >/dev/null 2>&1 || true
          aws logs put-retention-policy --log-group-name $LOG_GROUP --retention-in-days 7 --region ${{{{ env.AWS_REGION }}}} || true
          
          SERVICE_STATUS=$(aws ecs describe-services --cluster ${{{{ env.ECS_CLUSTER }}}} --services $ECS_SERVICE --region ${{{{ env.AWS_REGION }}}} --query 'services[0].status' --output text 2>/dev/null || echo "MISSING")
          
          if [ "$SERVICE_STATUS" != "ACTIVE" ]; then
            VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region ${{{{ env.AWS_REGION }}}} --query 'Vpcs[0].VpcId' --output text)
            SUBNETS=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID --region ${{{{ env.AWS_REGION }}}} --query 'Subnets[*].SubnetId' --output text | tr '\\t' ',')
            SG=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$VPC_ID Name=group-name,Values=default --region ${{{{ env.AWS_REGION }}}} --query 'SecurityGroups[0].GroupId' --output text)
            
            NS_ID=$(aws servicediscovery list-namespaces --query "Namespaces[?Name=='${{{{ env.NAMESPACE }}}}'].Id" --output text)
            
            # Create Discovery Service
            SVC_ID=$(aws servicediscovery create-service --name {name} --namespace-id $NS_ID --dns-config "NamespaceId=$NS_ID,RoutingPolicy=MULTIVALUE,DnsRecords=[{{Type=A,TTL=60}}]" --query 'Service.Id' --output text)
            
            TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json file://$TASK_DEF --region ${{{{ env.AWS_REGION }}}} --query 'taskDefinition.taskDefinitionArn' --output text)
            
            aws ecs create-service \\
              --cluster ${{{{ env.ECS_CLUSTER }}}} \\
              --service-name $ECS_SERVICE \\
              --task-definition $TASK_DEF_ARN \\
              --desired-count 1 \\
              --capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1 \\
              --network-configuration "awsvpcConfiguration={{subnets=[$SUBNETS],securityGroups=[$SG],assignPublicIp=ENABLED}}" \\
              --service-registries registryArn=$(aws servicediscovery get-service --id $SVC_ID --query 'Service.Arn' --output text) \\
              --region ${{{{ env.AWS_REGION }}}} >/dev/null
          else
            TASK_DEF_ARN=$(aws ecs register-task-definition --cli-input-json file://$TASK_DEF --region ${{{{ env.AWS_REGION }}}} --query 'taskDefinition.taskDefinitionArn' --output text)
            aws ecs update-service --cluster ${{{{ env.ECS_CLUSTER }}}} --service $ECS_SERVICE --task-definition $TASK_DEF_ARN --region ${{{{ env.AWS_REGION }}}} >/dev/null
          fi
"""

with open(os.path.join(workflows_dir, "deploy-aws-ecs-infra.yml"), "w") as f:
    f.write(workflow_template)
    for name, image, port, env in infra_components:
        f.write(append_service_step(name, port))

print("Created infra tasks and workflows.")
