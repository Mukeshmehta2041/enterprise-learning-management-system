#!/bin/bash

# Setup script for CI/CD pipeline configuration
# This script helps configure GitHub secrets and AWS resources for the CI/CD pipeline

set -e

echo "=========================================="
echo "LMS CI/CD Pipeline Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  https://cli.github.com/"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first:"
    echo "  https://aws.amazon.com/cli/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub. Please run: gh auth login"
    exit 1
fi

echo "Prerequisites check passed!"
echo ""

# Get repository information
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
print_info "Repository: $REPO"
echo ""

# Function to set GitHub secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    if [ -z "$secret_value" ]; then
        print_warning "Skipping $secret_name (no value provided)"
        return
    fi
    
    echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO"
    print_info "Set secret: $secret_name - $description"
}

# Function to prompt for secret
prompt_secret() {
    local secret_name=$1
    local description=$2
    local default_value=$3
    
    echo ""
    echo "----------------------------------------"
    echo "Secret: $secret_name"
    echo "Description: $description"
    if [ -n "$default_value" ]; then
        echo "Default: $default_value"
    fi
    echo "----------------------------------------"
    read -p "Enter value (or press Enter to skip): " value
    
    if [ -z "$value" ] && [ -n "$default_value" ]; then
        value=$default_value
    fi
    
    if [ -n "$value" ]; then
        set_secret "$secret_name" "$value" "$description"
    fi
}

echo "=========================================="
echo "AWS Configuration"
echo "=========================================="
echo ""

# Get AWS region
AWS_REGION=$(aws configure get region || echo "us-east-1")
print_info "Using AWS region: $AWS_REGION"

# AWS Credentials
prompt_secret "AWS_ACCESS_KEY_ID" "AWS Access Key ID for CI/CD deployments"
prompt_secret "AWS_SECRET_ACCESS_KEY" "AWS Secret Access Key for CI/CD deployments"

echo ""
echo "=========================================="
echo "Security Scanning Configuration"
echo "=========================================="
echo ""

print_info "Snyk Setup:"
echo "  1. Sign up at https://snyk.io"
echo "  2. Go to Account Settings → General"
echo "  3. Copy your API token"
prompt_secret "SNYK_TOKEN" "Snyk API token for security scanning"

print_info "SonarCloud Setup:"
echo "  1. Sign up at https://sonarcloud.io"
echo "  2. Import your repository"
echo "  3. Get your organization key and project key"
echo "  4. Generate a token in My Account → Security"
prompt_secret "SONAR_TOKEN" "SonarCloud authentication token"
prompt_secret "SONAR_ORGANIZATION" "SonarCloud organization key"
prompt_secret "SONAR_PROJECT_KEY" "SonarCloud project key"

echo ""
echo "=========================================="
echo "Staging Environment Configuration"
echo "=========================================="
echo ""

prompt_secret "S3_BUCKET_STAGING" "S3 bucket for staging frontend" "lms-frontend-staging"
prompt_secret "CLOUDFRONT_ID_STAGING" "CloudFront distribution ID for staging (optional)"
prompt_secret "VITE_API_BASE_URL_STAGING" "Staging API base URL" "https://api-staging.lms.example.com"
prompt_secret "STAGING_API_URL" "Staging API URL for health checks" "https://api-staging.lms.example.com"
prompt_secret "STAGING_FRONTEND_URL" "Staging frontend URL for health checks" "https://staging.lms.example.com"

echo ""
echo "=========================================="
echo "Production Environment Configuration"
echo "=========================================="
echo ""

prompt_secret "S3_BUCKET_PRODUCTION" "S3 bucket for production frontend" "lms-frontend-production"
prompt_secret "CLOUDFRONT_ID_PRODUCTION" "CloudFront distribution ID for production"
prompt_secret "VITE_API_BASE_URL_PRODUCTION" "Production API base URL" "https://api.lms.example.com"
prompt_secret "PRODUCTION_API_URL" "Production API URL for health checks" "https://api.lms.example.com"
prompt_secret "PRODUCTION_FRONTEND_URL" "Production frontend URL for health checks" "https://lms.example.com"
prompt_secret "RDS_INSTANCE_ID" "RDS instance identifier for backups" "lms-production"

echo ""
echo "=========================================="
echo "Notifications (Optional)"
echo "=========================================="
echo ""

print_info "Slack Webhook Setup:"
echo "  1. Go to https://api.slack.com/apps"
echo "  2. Create a new app or select existing"
echo "  3. Enable Incoming Webhooks"
echo "  4. Create a webhook for your channel"
prompt_secret "SLACK_WEBHOOK_URL" "Slack webhook URL for deployment notifications (optional)"

echo ""
echo "=========================================="
echo "GitHub Environment Setup"
echo "=========================================="
echo ""

print_info "Setting up GitHub Environments..."

# Create production environment (requires GitHub CLI with environment support)
print_info "Creating 'production' environment..."
echo "Please complete the following steps manually:"
echo "  1. Go to: https://github.com/$REPO/settings/environments"
echo "  2. Click 'New environment'"
echo "  3. Name: production"
echo "  4. Add required reviewers"
echo "  5. Set deployment branch to 'main' only"
echo ""
read -p "Press Enter when you've completed the environment setup..."

echo ""
echo "=========================================="
echo "AWS ECS Setup"
echo "=========================================="
echo ""

print_info "Creating ECS clusters..."

# Create staging cluster
if aws ecs describe-clusters --clusters lms-staging --region "$AWS_REGION" &> /dev/null; then
    print_info "Staging cluster 'lms-staging' already exists"
else
    aws ecs create-cluster --cluster-name lms-staging --region "$AWS_REGION"
    print_info "Created staging cluster 'lms-staging'"
fi

# Create production cluster
if aws ecs describe-clusters --clusters lms-production --region "$AWS_REGION" &> /dev/null; then
    print_info "Production cluster 'lms-production' already exists"
else
    aws ecs create-cluster --cluster-name lms-production --region "$AWS_REGION"
    print_info "Created production cluster 'lms-production'"
fi

echo ""
echo "=========================================="
echo "ECR Repositories Setup"
echo "=========================================="
echo ""

print_info "Creating ECR repositories for staging..."

services=(
    "lms-user-service-staging"
    "lms-auth-service-staging"
    "lms-course-service-staging"
    "lms-content-service-staging"
    "lms-enrollment-service-staging"
    "lms-assignment-service-staging"
    "lms-notification-service-staging"
    "lms-payment-service-staging"
    "lms-search-service-staging"
    "lms-analytics-service-staging"
    "lms-gateway-staging"
)

for service in "${services[@]}"; do
    if aws ecr describe-repositories --repository-names "$service" --region "$AWS_REGION" &> /dev/null; then
        print_info "Repository '$service' already exists"
    else
        aws ecr create-repository --repository-name "$service" --region "$AWS_REGION" > /dev/null
        print_info "Created repository '$service'"
    fi
done

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""

print_info "Next steps:"
echo "  1. Review the created secrets in GitHub repository settings"
echo "  2. Configure ECS services using scripts/setup-ecs-infrastructure.sh"
echo "  3. Test the pipeline by pushing to develop branch"
echo "  4. Review the documentation: docs/32-cicd-quality-gates.md"
echo ""
print_info "To trigger a staging deployment:"
echo "  git push origin develop"
echo ""
print_info "To trigger a production deployment:"
echo "  1. Create a version tag: git tag -a v1.0.0 -m 'Release v1.0.0'"
echo "  2. Push the tag: git push origin v1.0.0"
echo "  3. Go to Actions → Deploy to Production → Run workflow"
echo "  4. Enter the version tag: v1.0.0"
echo ""

print_info "Setup completed successfully!"
