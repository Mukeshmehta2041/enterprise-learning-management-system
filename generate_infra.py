import os
import json

# Format: name, image, port, env variables, mount_path
infra_components = [
    ("postgres", "postgres:15-alpine", 5432, [
        {"name": "POSTGRES_DB", "value": "lms"},
        {"name": "POSTGRES_USER", "value": "lms"},
        {"name": "POSTGRES_PASSWORD", "value": "lms_password"}
    ], "/var/lib/postgresql/data"),
    
    ("redis", "redis:7-alpine", 6379, [], ""),
    
    ("kafka", "redpandadata/redpanda:latest", 9092, [
        {"name": "REDPANDA_AUTO_CONFIG", "value": "true"}
    ], "/var/lib/redpanda/data"),
    
    ("elastic", "elasticsearch:7.17.10", 9200, [
        {"name": "discovery.type", "value": "single-node"}
    ], "/usr/share/elasticsearch/data")
]

base_dir = "/Users/mukeshkumar/Developer/projects/spring-boot/learning-managment-system"
workflows_dir = os.path.join(base_dir, ".github/workflows")
aws_dir = os.path.join(base_dir, ".aws")

for name, image, port, env, mount_path in infra_components:
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
    
    # Inject EFS Volume if a mount_path exists
    if mount_path:
        task_def["volumes"] = [
            {
                "name": f"efs-{name}-data",
                "efsVolumeConfiguration": {
                    "fileSystemId": "EFS_ID_PLACEHOLDER",
                    "transitEncryption": "ENABLED"
                }
            }
        ]
        task_def["containerDefinitions"][0]["mountPoints"] = [
            {
                "sourceVolume": f"efs-{name}-data",
                "containerPath": mount_path,
                "readOnly": False
            }
        ]
    
    # Write JSON task def
    json_path = os.path.join(aws_dir, f"ecs-task-def-{name}.json")
    with open(json_path, "w") as f:
        json.dump(task_def, f, indent=2)

workflow_template = """name: Deploy LMS Infrastructure (DB, Redis, Kafka, Elastic)

on:
  workflow_dispatch: # Manual trigger to spin up databases

env:
  AWS_REGION: us-east-1                  
  ECS_CLUSTER: lms-fargate-cluster    
  NAMESPACE: lms.internal

jobs:
  deploy_infra:
    name: Deploy Infrastructure with Persistent EFS
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
          
      - name: Ensure EFS Hard Drives Exist
        run: |
          VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region ${{ env.AWS_REGION }} --query 'Vpcs[0].VpcId' --output text)
          SG=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$VPC_ID Name=group-name,Values=default --region ${{ env.AWS_REGION }} --query 'SecurityGroups[0].GroupId' --output text)
          # Open NFS Port for EFS
          aws ec2 authorize-security-group-ingress --group-id $SG --protocol tcp --port 2049 --source-group $SG --region ${{ env.AWS_REGION }} 2>/dev/null || true
          
          # Auto-create EFS components
          for DB in postgres kafka elastic; do
             EFS_ID=$(aws efs describe-file-systems --query "FileSystems[?Name=='lms-efs-${DB}'].FileSystemId" --output text)
             if [ -z "$EFS_ID" ] || [ "$EFS_ID" == "None" ]; then
               EFS_ID=$(aws efs create-file-system --performance-mode generalPurpose --throughput-mode bursting --encrypted --tags Key=Name,Value=lms-efs-${DB} --query 'FileSystemId' --output text --region ${{ env.AWS_REGION }})
               echo "Waiting for EFS $DB creation..."
               sleep 10
             fi
             
             # Create Mount Targets in every subnet so Fargate can reach it
             SUBNETS=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID --region ${{ env.AWS_REGION }} --query 'Subnets[*].SubnetId' --output text)
             for SUBNET in $SUBNETS; do
                MOUNT=$(aws efs describe-mount-targets --file-system-id $EFS_ID --query "MountTargets[?SubnetId=='$SUBNET'].MountTargetId" --output text)
                if [ -z "$MOUNT" ] || [ "$MOUNT" == "None" ]; then
                  aws efs create-mount-target --file-system-id $EFS_ID --subnet-id $SUBNET --security-groups $SG --region ${{ env.AWS_REGION }} || true
                fi
             done
             sleep 5
          done
"""

def append_service_step(name, port, has_mount):
    return f"""
      - name: Deploy {name.upper()} 
        run: |
          ECS_SERVICE="lms-{name}-service"
          CONTAINER_NAME="lms-{name}-service"
          TASK_DEF=".aws/ecs-task-def-{name}.json"
          
          # Replace Account ID
          sed -i 's/448100672347/${{{{ secrets.AWS_ACCOUNT_ID }}}}/g' $TASK_DEF
          
          # Identify EFS ID and Inject it dynamically
          {"EFS_ID=$(aws efs describe-file-systems --query \\"FileSystems[?Name=='lms-efs-" + name + "'].FileSystemId\\" --output text)" if has_mount else ""}
          {"sed -i \\"s/EFS_ID_PLACEHOLDER/$EFS_ID/g\\" $TASK_DEF" if has_mount else ""}
          
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
    for name, image, port, env, mount_path in infra_components:
        f.write(append_service_step(name, port, bool(mount_path)))

print("Created infra tasks and workflows with EFS persistent storage.")
