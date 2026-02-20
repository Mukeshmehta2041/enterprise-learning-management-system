# CI/CD Pipeline Documentation

This directory contains the GitHub Actions workflows for the LMS project's CI/CD pipeline.

## Workflows

### 1. Quality Gates (`quality-gates.yml`)

Runs on all pull requests and pushes to ensure code quality and security.

**Jobs:**

- **Security Scanning**: OWASP Dependency Check and Snyk
- **Code Quality**: SonarCloud analysis with coverage requirements
- **Frontend Quality**: Linting, type checking, and test coverage

**Triggers:**

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

### 2. Main CI/CD (`cicd.yml`)

Enhanced main workflow that builds and deploys services.

**Jobs:**

- Runs quality gates first
- Filters changed services
- Builds backend services with Maven
- Builds frontend with npm
- Pushes Docker images to ECR
- Deploys to AWS ECS (main branch only)

**Triggers:**

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

### 3. Staging Deployment (`deploy-staging.yml`)

Automated deployment to staging environment.

**Jobs:**

- Build and test all changed components
- Deploy backend services to ECS staging cluster
- Deploy frontend to S3 staging bucket
- Run smoke tests
- Send notifications

**Triggers:**

- Push to `develop` branch
- Manual workflow dispatch

### 4. Production Deployment (`deploy-production.yml`)

Manual deployment to production with approval gates.

**Jobs:**

- Pre-deployment checks
- Manual approval gate (GitHub Environments)
- Database backup
- Blue-green deployment to production
- Post-deployment tests
- Automatic rollback on failure
- Notifications and release creation

**Triggers:**

- Manual workflow dispatch with version tag

### 5. VPS Deployment (`deploy-vps.yml`)

Alternative deployment to VPS using Docker Compose.

**Triggers:**

- Push to `main` branch (service changes only)

## Setup Instructions

### Prerequisites

1. **GitHub CLI**: Install from [cli.github.com](https://cli.github.com/)
2. **AWS CLI**: Install from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **AWS Account**: With appropriate permissions
4. **Third-party Accounts**:
   - [Snyk](https://snyk.io) for security scanning
   - [SonarCloud](https://sonarcloud.io) for code quality

### Quick Setup

Run the automated setup script:

```bash
./scripts/setup-cicd.sh
```

This script will:

- Configure GitHub secrets
- Create AWS ECS clusters
- Create ECR repositories
- Guide you through third-party service setup

### Manual Setup

If you prefer manual setup, follow these steps:

#### 1. Configure GitHub Secrets

Go to repository Settings → Secrets and variables → Actions, and add:

**AWS Secrets:**

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**Security Scanning:**

- `SNYK_TOKEN`
- `SONAR_TOKEN`
- `SONAR_ORGANIZATION`
- `SONAR_PROJECT_KEY`

**Staging Environment:**

- `S3_BUCKET_STAGING`
- `CLOUDFRONT_ID_STAGING`
- `VITE_API_BASE_URL_STAGING`
- `STAGING_API_URL`
- `STAGING_FRONTEND_URL`

**Production Environment:**

- `S3_BUCKET_PRODUCTION`
- `CLOUDFRONT_ID_PRODUCTION`
- `VITE_API_BASE_URL_PRODUCTION`
- `PRODUCTION_API_URL`
- `PRODUCTION_FRONTEND_URL`
- `RDS_INSTANCE_ID`

**Optional:**

- `SLACK_WEBHOOK_URL`

#### 2. Create GitHub Environment

1. Go to Settings → Environments
2. Create environment named `production`
3. Add required reviewers
4. Set deployment branch to `main` only

#### 3. Create AWS Resources

```bash
# Create ECS clusters
aws ecs create-cluster --cluster-name lms-staging
aws ecs create-cluster --cluster-name lms-production

# Create ECR repositories
./scripts/setup-ecr-repos.sh us-east-1
```

## Usage

### Development Workflow

1. **Create feature branch:**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit:**

   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push and create PR:**

   ```bash
   git push origin feature/my-feature
   ```

   - Quality gates will run automatically
   - All checks must pass before merge

4. **Merge to develop:**
   - Merging triggers automatic staging deployment
   - Monitor deployment in Actions tab

### Staging Deployment

**Automatic:**

- Push to `develop` branch triggers deployment

**Manual:**

1. Go to Actions → Deploy to Staging
2. Click "Run workflow"
3. Select `develop` branch
4. Click "Run workflow"

### Production Deployment

1. **Create version tag:**

   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Trigger deployment:**
   - Go to Actions → Deploy to Production
   - Click "Run workflow"
   - Enter version tag: `v1.0.0`
   - Click "Run workflow"

3. **Approve deployment:**
   - Workflow will pause at approval gate
   - Designated reviewers will receive notification
   - Review changes and approve in GitHub UI

4. **Monitor deployment:**
   - Watch workflow progress in Actions tab
   - Check ECS console for service updates
   - Verify health checks pass

## Quality Gates

### Backend Quality Requirements

- ✅ All tests must pass
- ✅ Code coverage ≥ 80%
- ✅ No high/critical security vulnerabilities
- ✅ CVSS score < 7 for dependencies
- ✅ SonarCloud quality gate passes

### Frontend Quality Requirements

- ✅ ESLint passes with no errors
- ✅ TypeScript compilation succeeds
- ✅ All tests pass
- ✅ Code coverage ≥ 80%
- ✅ No high severity npm vulnerabilities

### Running Quality Checks Locally

**Backend:**

```bash
# Run tests with coverage
mvn clean verify -Pcoverage

# Run security scan
mvn org.owasp:dependency-check-maven:check -Psecurity

# View coverage report
open target/site/jacoco/index.html
```

**Frontend:**

```bash
cd frontend

# Run all checks
npm run lint
npm run typecheck
npm run test -- --run --coverage

# View coverage report
open coverage/index.html
```

## Troubleshooting

### Quality Gate Failures

**Coverage below threshold:**

- Add missing unit tests
- Review coverage report to identify gaps
- Ensure test files are properly named (`*.test.ts`, `*Test.java`)

**Security vulnerabilities:**

- Update dependencies: `mvn versions:display-dependency-updates`
- For false positives, add to `owasp-suppressions.xml`
- Check Snyk for upgrade paths

**SonarCloud issues:**

- Review code smells and bugs in SonarCloud dashboard
- Fix critical and high severity issues
- Add exclusions in `sonar-project.properties` if needed

### Deployment Failures

**ECS service won't stabilize:**

- Check CloudWatch logs for the service
- Verify environment variables in task definition
- Check security group rules
- Ensure database/Kafka/Redis connectivity

**Health check failures:**

- Verify `/actuator/health` endpoint
- Check application startup logs
- Ensure all dependencies are accessible
- Verify correct environment configuration

**Rollback:**

- Production workflow automatically rolls back on failure
- Manual rollback: Re-run previous successful deployment
- Or update ECS service to previous task definition in AWS console

## Monitoring

### Workflow Status

- View all workflow runs in Actions tab
- Download artifacts (test reports, coverage, security scans)
- Check workflow logs for detailed information

### Deployment Status

- **ECS Console**: Monitor service health and task status
- **CloudWatch**: View application logs and metrics
- **CloudFront**: Check cache invalidation status
- **S3**: Verify frontend deployment

### Notifications

Configure Slack webhook to receive:

- Deployment start/completion notifications
- Failure alerts
- Rollback notifications

## Best Practices

1. **Always run quality checks locally before pushing**
2. **Keep dependencies up to date**
3. **Review security scan reports regularly**
4. **Test in staging before production deployment**
5. **Use semantic versioning for releases**
6. **Document breaking changes in release notes**
7. **Monitor deployments and respond to alerts**
8. **Rotate AWS credentials regularly**

## Additional Resources

- [Full CI/CD Documentation](../docs/32-cicd-quality-gates.md)
- [AWS ECS Deployment Guide](../docs/31-aws-ecs-fargate-deployment.md)
- [DevOps Guide](../docs/09-devops.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)

## Support

For issues or questions:

1. Check workflow logs in Actions tab
2. Review documentation in `docs/` directory
3. Check AWS CloudWatch logs
4. Contact DevOps team
