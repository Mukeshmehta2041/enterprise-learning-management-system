# 32. CI/CD Pipeline with Quality Gates and Automated Deployment

## Overview

This document describes the enhanced CI/CD pipeline for the LMS project, including quality gates, security scanning, automated testing, and deployment workflows for staging and production environments.

## Pipeline Architecture

### Workflow Structure

The CI/CD pipeline consists of three main workflows:

1. **Quality Gates** (`.github/workflows/quality-gates.yml`) - Runs on all PRs and pushes
2. **Staging Deployment** (`.github/workflows/deploy-staging.yml`) - Deploys to staging on develop branch
3. **Production Deployment** (`.github/workflows/deploy-production.yml`) - Manual deployment with approval gates

### Main CI/CD Workflow

The main workflow (`.github/workflows/cicd.yml`) has been enhanced to:

- Run quality gates before any build or deployment
- Use path filtering to only build changed services
- Build and push Docker images to ECR
- Deploy to AWS ECS Fargate

## Quality Gates

### Security Scanning

#### OWASP Dependency Check

- Scans all Maven dependencies for known vulnerabilities
- Fails build on CVSS score >= 7
- Generates HTML report uploaded as artifact
- Configuration: `owasp-suppressions.xml` for false positive suppression

```bash
# Run locally
mvn org.owasp:dependency-check-maven:check -Psecurity
```

#### Snyk Security Scan

- Scans both backend (Maven) and frontend (npm) dependencies
- Integrates with GitHub Security tab (SARIF upload)
- Fails on high severity vulnerabilities that are upgradable
- Requires `SNYK_TOKEN` secret

**Setup:**

1. Sign up at [snyk.io](https://snyk.io)
2. Get API token from account settings
3. Add as `SNYK_TOKEN` repository secret

### Code Quality Analysis

#### SonarCloud Integration

- Analyzes code quality, bugs, code smells, and security hotspots
- Tracks test coverage (requires 80% minimum)
- Provides quality gate status on PRs
- Configuration: `sonar-project.properties`

**Setup:**

1. Import project at [sonarcloud.io](https://sonarcloud.io)
2. Add secrets:
   - `SONAR_TOKEN`: Project token from SonarCloud
   - `SONAR_ORGANIZATION`: Your organization key
   - `SONAR_PROJECT_KEY`: Project key

```bash
# Run locally
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=your-project-key \
  -Dsonar.organization=your-org \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=your-token
```

#### JaCoCo Code Coverage

- Measures test coverage for Java code
- Enforces 80% line coverage minimum
- Generates XML reports for SonarCloud
- Activated with `-Pcoverage` profile

```bash
# Run tests with coverage
mvn clean verify -Pcoverage

# View report
open target/site/jacoco/index.html
```

### Frontend Quality Gates

- **ESLint**: Code linting for TypeScript/React
- **TypeScript**: Type checking
- **Vitest**: Unit tests with coverage
- **Coverage Threshold**: 80% minimum

```bash
cd frontend
npm run lint
npm run typecheck
npm run test -- --run --coverage
```

## Deployment Workflows

### Staging Deployment

**Trigger:** Push to `develop` branch or manual dispatch

**Process:**

1. Run all tests (backend and frontend)
2. Build and push Docker images to ECR (staging repositories)
3. Update ECS services in `lms-staging` cluster
4. Wait for service stability
5. Run smoke tests
6. Send notification (Slack)

**Required Secrets:**

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `VITE_API_BASE_URL_STAGING`
- `S3_BUCKET_STAGING`
- `CLOUDFRONT_ID_STAGING`
- `STAGING_API_URL`
- `STAGING_FRONTEND_URL`
- `SLACK_WEBHOOK_URL` (optional)

### Production Deployment

**Trigger:** Manual workflow dispatch with version tag

**Process:**

1. **Pre-deployment checks**
   - Verify version tag exists
   - Check staging environment health
   - Verify quality gates passed

2. **Approval gate**
   - Requires manual approval via GitHub Environments
   - Configure in Settings → Environments → production
   - Add required reviewers

3. **Backup**
   - Create RDS snapshot before deployment
   - Wait for snapshot completion

4. **Deployment**
   - Build and push images with version tag
   - Deploy services with rolling update (max 2 parallel)
   - Wait for service stability after each deployment
   - Run health checks

5. **Post-deployment tests**
   - Smoke tests on all critical endpoints
   - Performance checks (response time < 2s)

6. **Rollback on failure**
   - Automatic rollback if any step fails
   - Force new deployment to previous version

7. **Notification**
   - Send deployment status to Slack
   - Create GitHub release on success

**Required Secrets:**

- All staging secrets plus:
- `RDS_INSTANCE_ID`
- `VITE_API_BASE_URL_PRODUCTION`
- `S3_BUCKET_PRODUCTION`
- `CLOUDFRONT_ID_PRODUCTION`
- `PRODUCTION_API_URL`
- `PRODUCTION_FRONTEND_URL`

## GitHub Environments Setup

### Creating Production Environment

1. Go to repository Settings → Environments
2. Click "New environment"
3. Name: `production`
4. Configure protection rules:
   - ✅ Required reviewers (add team members)
   - ✅ Wait timer: 5 minutes (optional)
   - ✅ Deployment branches: Only `main` branch
5. Add environment-specific secrets

## Secrets Configuration

### Required Secrets

| Secret                         | Description              | Used In           |
| ------------------------------ | ------------------------ | ----------------- |
| `AWS_ACCESS_KEY_ID`            | AWS access key           | All workflows     |
| `AWS_SECRET_ACCESS_KEY`        | AWS secret key           | All workflows     |
| `SNYK_TOKEN`                   | Snyk API token           | Quality gates     |
| `SONAR_TOKEN`                  | SonarCloud token         | Quality gates     |
| `SONAR_ORGANIZATION`           | SonarCloud org           | Quality gates     |
| `SONAR_PROJECT_KEY`            | SonarCloud project       | Quality gates     |
| `S3_BUCKET_STAGING`            | Staging S3 bucket        | Staging deploy    |
| `S3_BUCKET_PRODUCTION`         | Production S3 bucket     | Production deploy |
| `CLOUDFRONT_ID_STAGING`        | Staging CloudFront       | Staging deploy    |
| `CLOUDFRONT_ID_PRODUCTION`     | Production CloudFront    | Production deploy |
| `VITE_API_BASE_URL_STAGING`    | Staging API URL          | Staging deploy    |
| `VITE_API_BASE_URL_PRODUCTION` | Production API URL       | Production deploy |
| `STAGING_API_URL`              | Staging backend URL      | Smoke tests       |
| `STAGING_FRONTEND_URL`         | Staging frontend URL     | Smoke tests       |
| `PRODUCTION_API_URL`           | Production backend URL   | Smoke tests       |
| `PRODUCTION_FRONTEND_URL`      | Production frontend URL  | Smoke tests       |
| `RDS_INSTANCE_ID`              | RDS instance identifier  | Production backup |
| `SLACK_WEBHOOK_URL`            | Slack webhook (optional) | Notifications     |

## Local Development

### Running Quality Checks Locally

```bash
# Backend security scan
mvn org.owasp:dependency-check-maven:check -Psecurity

# Backend tests with coverage
mvn clean verify -Pcoverage

# Frontend quality checks
cd frontend
npm run lint
npm run typecheck
npm run test -- --run --coverage
```

### Testing Docker Builds

```bash
# Build a service
docker build -t lms-user-service services/lms-user-service

# Test the image
docker run -p 8080:8080 lms-user-service
```

## Monitoring and Troubleshooting

### Viewing Workflow Runs

1. Go to Actions tab in GitHub
2. Select workflow from left sidebar
3. Click on specific run to view details
4. Download artifacts (OWASP reports, coverage reports)

### Common Issues

#### Quality Gate Failures

**OWASP Dependency Check fails:**

- Review the HTML report artifact
- Add suppressions to `owasp-suppressions.xml` if false positive
- Update dependencies if legitimate vulnerability

**Coverage below threshold:**

- Run `mvn verify -Pcoverage` locally
- Add missing tests
- Review coverage report: `target/site/jacoco/index.html`

**Snyk scan fails:**

- Check if upgrades are available: `npm audit` or `mvn versions:display-dependency-updates`
- Update dependencies
- Add Snyk policy if needed

#### Deployment Failures

**ECS service won't stabilize:**

- Check ECS console for task failures
- Review CloudWatch logs for the service
- Verify environment variables and secrets
- Check security group rules

**Health checks fail:**

- Verify `/actuator/health` endpoint is accessible
- Check application logs in CloudWatch
- Ensure database connectivity
- Verify Kafka/Redis connectivity

**Rollback needed:**

- Workflow automatically rolls back on failure
- Manual rollback: Re-run previous successful deployment
- Or use AWS console to update service to previous task definition

## Best Practices

### Branch Strategy

- `develop`: Integration branch, auto-deploys to staging
- `main`: Production branch, manual deployment with approval
- Feature branches: Create PR to `develop`, must pass quality gates

### Version Tagging

```bash
# Create version tag for production release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Deploy to production
# Go to Actions → Deploy to Production → Run workflow
# Enter version: v1.0.0
```

### Security

- Never commit secrets to repository
- Rotate AWS credentials regularly
- Use least-privilege IAM roles
- Enable MFA for production approvers
- Review security scan reports weekly

### Performance

- Monitor deployment times
- Optimize Docker image sizes (multi-stage builds)
- Use layer caching effectively
- Parallelize independent service deployments

## Metrics and KPIs

Track these metrics to measure CI/CD effectiveness:

- **Build Success Rate**: Target > 95%
- **Deployment Frequency**: Track deployments per week
- **Lead Time**: Time from commit to production
- **Mean Time to Recovery (MTTR)**: Time to rollback/fix
- **Test Coverage**: Maintain > 80%
- **Security Vulnerabilities**: Track and remediate high/critical

## Future Enhancements

- [ ] Implement canary deployments with traffic shifting
- [ ] Add performance testing in pipeline
- [ ] Integrate contract testing between services
- [ ] Add automated database migration validation
- [ ] Implement feature flag integration
- [ ] Add chaos engineering tests
- [ ] Set up automated security penetration testing
- [ ] Implement blue-green deployment strategy

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Deployment](./31-aws-ecs-fargate-deployment.md)
- [DevOps Guide](./09-devops.md)
- [OWASP Dependency Check](https://jeremylong.github.io/DependencyCheck/)
- [Snyk Documentation](https://docs.snyk.io/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
