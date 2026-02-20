# CI/CD Pipeline Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites

- GitHub CLI installed: `brew install gh` (Mac) or see [cli.github.com](https://cli.github.com/)
- AWS CLI installed: `brew install awscli` (Mac) or see [aws.amazon.com/cli](https://aws.amazon.com/cli/)
- Authenticated with both: `gh auth login` and `aws configure`

### Automated Setup

```bash
./scripts/setup-cicd.sh
```

This script will guide you through:

1. Configuring GitHub secrets
2. Setting up AWS ECS clusters
3. Creating ECR repositories
4. Configuring third-party integrations

## 📋 Required Accounts

### 1. Snyk (Security Scanning)

- Sign up: [snyk.io](https://snyk.io)
- Get token: Account Settings → General → API Token
- Add to GitHub: Settings → Secrets → `SNYK_TOKEN`

### 2. SonarCloud (Code Quality)

- Sign up: [sonarcloud.io](https://sonarcloud.io)
- Import repository
- Get token: My Account → Security → Generate Token
- Add to GitHub:
  - `SONAR_TOKEN`
  - `SONAR_ORGANIZATION` (your org key)
  - `SONAR_PROJECT_KEY` (your project key)

## 🔄 Daily Workflow

### Working on a Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and test locally
mvn clean verify -Pcoverage  # Backend
cd frontend && npm test       # Frontend

# 3. Commit and push
git add .
git commit -m "Add feature"
git push origin feature/my-feature

# 4. Create PR
# Quality gates run automatically
# Merge when all checks pass
```

### Deploy to Staging

```bash
# Automatic on merge to develop
git checkout develop
git merge feature/my-feature
git push origin develop
# Watch deployment in Actions tab
```

### Deploy to Production

```bash
# 1. Create version tag
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. Trigger deployment
# Go to: Actions → Deploy to Production → Run workflow
# Enter version: v1.0.0

# 3. Approve deployment
# Designated reviewers approve in GitHub UI

# 4. Monitor
# Watch Actions tab for progress
```

## ✅ Quality Checks

### Run Locally Before Pushing

**Backend:**

```bash
# All checks
mvn clean verify -Pcoverage

# Just tests
mvn test

# Security scan
mvn org.owasp:dependency-check-maven:check -Psecurity
```

**Frontend:**

```bash
cd frontend

# All checks
npm run lint && npm run typecheck && npm test -- --run

# Just tests
npm test -- --run

# With coverage
npm test -- --run --coverage
```

## 🎯 Quality Requirements

- ✅ All tests pass
- ✅ Code coverage ≥ 80%
- ✅ No high/critical security vulnerabilities
- ✅ Linting passes
- ✅ Type checking passes
- ✅ SonarCloud quality gate passes

## 🔧 Troubleshooting

### Quality Gate Failed

**Coverage too low:**

```bash
# View coverage report
mvn verify -Pcoverage
open target/site/jacoco/index.html  # Backend
open frontend/coverage/index.html    # Frontend
# Add tests for uncovered code
```

**Security vulnerabilities:**

```bash
# Check for updates
mvn versions:display-dependency-updates  # Backend
npm audit                                 # Frontend

# Update dependencies
mvn versions:use-latest-versions
npm update
```

**Linting errors:**

```bash
cd frontend
npm run lint -- --fix  # Auto-fix
```

### Deployment Failed

**Check logs:**

1. Go to Actions tab
2. Click failed workflow
3. Expand failed job
4. Review error messages

**Common issues:**

- Missing secrets → Add in Settings → Secrets
- AWS permissions → Check IAM role
- Health check failed → Check CloudWatch logs
- Service won't stabilize → Check ECS console

**Rollback:**

- Production: Automatic on failure
- Manual: Re-run previous successful deployment

## 📊 Monitoring

### GitHub Actions

- View all runs: Actions tab
- Download artifacts: Click run → Artifacts section
- Check logs: Click run → Expand job steps

### AWS Console

- **ECS**: Monitor service health
- **CloudWatch**: View application logs
- **ECR**: Check image versions

## 🔐 Security Best Practices

1. **Never commit secrets** to repository
2. **Rotate credentials** regularly
3. **Review security scans** weekly
4. **Update dependencies** monthly
5. **Use MFA** for production approvals

## 📚 Full Documentation

- [Complete CI/CD Guide](docs/32-cicd-quality-gates.md)
- [AWS ECS Deployment](docs/31-aws-ecs-fargate-deployment.md)
- [DevOps Guide](docs/09-devops.md)
- [GitHub Workflows README](.github/README.md)

## 🆘 Getting Help

1. Check workflow logs in Actions tab
2. Review documentation in `docs/` directory
3. Check AWS CloudWatch logs
4. Ask in team Slack channel

## 🎉 Success Checklist

- [ ] Ran `./scripts/setup-cicd.sh`
- [ ] Configured Snyk account and token
- [ ] Configured SonarCloud account and token
- [ ] Added all required GitHub secrets
- [ ] Created production environment with reviewers
- [ ] Tested quality gates with a PR
- [ ] Successfully deployed to staging
- [ ] Successfully deployed to production

---

**Need help?** Check the full documentation or ask the DevOps team!
