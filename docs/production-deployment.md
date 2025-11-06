# Production Architecture - Executive Summary

## Introduction

This document explains how the production infrastructure works for our web application, which includes an API (NestJS) and a web application (Next.js), deployed on AWS.

---

## Architecture Diagram

**[See Diagram 1: System Overview](#diagram-1-system-overview)**

### Main Components

- **Servers**: Serverless containers (ECS Fargate) that run the application
- **Load Balancer**: Distributes traffic across multiple servers
- **Database**: PostgreSQL 15 with automatic backup across multiple zones
- **Network**: Virtual Private Cloud (VPC) organized into different security areas
- **Image Storage**: Amazon ECR stores application versions
- **Monitoring**: CloudWatch records everything that happens, X-Ray traces requests
- **Secrets**: AWS Secrets Manager protects passwords and keys

### Why did we choose these technologies?

**Why ECS Fargate?**

- We don't need to worry about maintaining servers
- Automatically adjusts when there are more users
- We only pay for what we use
- Integrates seamlessly with other AWS services

**Why use multiple zones?**

- The application keeps working even if a data center fails
- Automatic switch to another zone in less than 60 seconds
- We can update without interrupting service

---

## Database Strategy

### PostgreSQL on RDS

**Configuration**:

- Server: `db.t4g.medium` (2 processors, 4 GB memory)
- Storage: 100 GB with 3000 operations per second
- Backup: Enabled across multiple zones for greater security
- Encryption: Both at rest and during transmission

### Data Design

Main tables organized efficiently:

- `users`: User accounts
- `items`: Main business information with duplicate protection
- `audit_log`: Change tracking (optional)

Indexes optimized for fast searches.

### Backups and Recovery

**Automated Backups**:

- Daily copy at 2:00 AM (UTC time)
- Stored for 7 days (configurable up to 35 days)
- Recovery to any point in the last 5 minutes

**Manual Backups**:

- Before each major update
- Stored for 30 days
- Copy to another region for security

**Recovery Metrics**:

- Maximum data loss: 5 minutes
- Recovery time: 10-30 minutes

### Data Migrations

**Tool**: TypeORM Migrations

**Strategy**:

- Version-controlled changes with timestamps
- Changes compatible with previous versions
- Blue-green pattern for major changes
- Automatic in testing, manual approval in production

**Process**:

1. Create migration in development
2. Review generated SQL
3. Test in staging environment
4. Deploy to production during maintenance window
5. Verify everything worked correctly

---

## CI/CD Pipeline

**[See Diagram 2: CI/CD Flow](#diagram-2-cicd-flow)**

### Pipeline Stages

**Continuous Integration** (what happens automatically with each change):

1. **Code Review**: ESLint and Prettier check formatting
2. **Unit Tests**: Jest verifies each function works well
3. **Integration Tests**: Verify everything works together
4. **Build**: Creates Docker images
5. **Security Scan**: Trivy searches for vulnerabilities

**Continuous Deployment** (how code reaches production):

1. **Push to ECR**: Stores images with unique identifier
2. **Deploy to Staging**: Automatically deployed
3. **Smoke Tests**: Verifies everything basically works
4. **Manual Approval**: Someone from the team must approve
5. **Deploy to Production**: Blue/Green strategy without interruptions
6. **Verification**: Active monitoring and alerts

### Deployment Strategy: Blue/Green

**Why Blue/Green?**

- Zero downtime
- We can roll back in less than 30 seconds if something fails
- We test in an environment identical to production
- We reduce the risk of errors

**Process**:

1. Deploy new version in "Green" environment
2. Verify everything works (2-5 minutes)
3. Switch traffic from "Blue" to "Green" (instantaneous)
4. Monitor intensively (10 minutes)
5. Keep "Blue" active for 30 minutes in case we need to go back
6. If everything is fine, shut down "Blue"

### Artifacts

**Docker Images**:

- Stored in Amazon ECR
- Tagged with: unique identifier, `latest`, semantic version
- We keep the last 10 versions + all official versions
- Cleanup: Remove untagged images after 30 days

### Rollback Strategy

**Automatic Rollback triggers when**:

- Errors > 1% for 5 minutes
- Very slow response time (>2 seconds) for 3 minutes
- More than 50% of health checks fail
- Critical alerts fire

**Manual Rollback**:

- Blue/Green: Return traffic to Blue (<30 seconds)
- Task Definition: Return to previous version (2-3 minutes)
- Re-deploy: Deploy previous commit (5-7 minutes)

---

## Code Changes Diagram

**[See Diagram 5: Code Changes Flow](#diagram-5-code-changes-flow)**

### Types of Changes

**New Features**:

- New characteristics or significant improvements
- Example: Add notification system, new reports module
- Tag: `feature/descriptive-name`
- Requires: Complete tests and documentation

**Fixes**:

- Bug or error solutions
- Example: Fix calculation error, repair broken link
- Tag: `fix/problem-description`
- Requires: Regression tests

**Improvements**:

- Performance optimizations or refactoring
- Example: Improve loading speed, optimize queries
- Tag: `improvement/what-is-improved`
- Requires: Before/after performance measurements

**Security Updates**:

- Security patches or critical updates
- Example: Update vulnerable dependency
- Tag: `security/description`
- Priority: High, deployed as soon as possible

### Change Process

1. **Developer creates branch**: From `main` with descriptive name
2. **Implements change**: Code + tests + documentation
3. **Local tests**: Verifies everything works on their machine
4. **Push to repository**: Uploads changes to Git server
5. **Automated pipeline**: All validations run
6. **Code Review**: Another developer reviews the code
7. **Approval**: If everything is fine, the change is approved
8. **Merge to main**: Change is integrated into main branch
9. **Deploy to Staging**: Automatic for final tests
10. **Approval for Production**: Final review before real users
11. **Deploy to Production**: With Blue/Green strategy
12. **Post-deployment monitoring**: Active surveillance for 24 hours

## Observability (How we know everything works well)

**[See Diagram 3: Observability Architecture](#diagram-3-observability-architecture)**

### Logs

**Format**: Structured JSON for easy searching

**What we log**:

- Contextual information (user, request ID, duration)
- Levels: ERROR (errors), WARN (warnings), INFO (information), DEBUG (technical details)
- We keep: 30 days for application, 7 days for database

**Log Groups**:

- `/ecs/production/api` - API logs
- `/ecs/production/web` - Web application logs
- `/rds/production/postgresql` - Database logs

**Important Queries**:

- Error grouping by context
- Response times by percentiles
- Request rate per minute

### Metrics

**Golden Signals** (the 4 most important metrics):

1. **Latency**: How fast the application responds
2. **Traffic**: How many requests we receive per second
3. **Errors**: Percentage of server errors
4. **Saturation**: CPU, memory, and database connection usage

**Custom Metrics**:

- Items created per hour
- Active users
- Duplicate requests detected

**Infrastructure Metrics**:

- Container resource usage
- Database operations and active connections
- Load balancer response times

### Distributed Tracing

**Tool**: AWS X-Ray

**What it captures**:

- Complete flow of each request (Web → API → Database)
- Dependencies between services and their times
- Errors with detailed information
- Performance bottlenecks

**Service Map**: Automatic graph showing how all services connect and their health.

### Health Checks

**Endpoints**:

- `/health`: Complete check (database, memory)
- `/ready`: Is it ready to receive traffic?
- `/live`: Is the container alive?

**Load Balancer Configuration**:

- Checks every 30 seconds
- Waits maximum 5 seconds for response
- 2 consecutive successes = Healthy
- 3 consecutive failures = Unhealthy

### Alerts

**CloudWatch Alarms**:
| Alert | What it measures | Limit | Action | Severity |
| ----------------------- | ----------------------- | ------------------ | --------- | -------- |
| Many Errors | Server errors | >10 in 5 min | PagerDuty | Critical |
| Slow Response | Response time | >2 sec in 5 min | Slack | Warning |
| Few DB Connections | Available connections | <5 available | Slack | Warning |
| Container Down | Healthy containers | <1 | PagerDuty | Critical |
| Low Disk Space | Free space | <10 GB | Slack | Warning |

**Escalation Policy**:

- **Level 1** (Warning): Slack notification, 30-minute response (business hours)
- **Level 2** (Error): Slack + Email, 15-minute response
- **Level 3** (Critical): PagerDuty on-call, 5-minute response, escalate after 15 minutes

**Solution Guides**: Each alert includes a link to documentation with:

- Symptom description
- Investigation steps
- Mitigation procedures
- Contact information

---

## Security

### Secrets Management

**Tool**: AWS Secrets Manager

**Stored Secrets**:

- Database credentials (automatic rotation every 30 days)
- JWT keys for authentication
- Third-party API keys
- Service tokens

**Access Control**:

- Containers access secrets through IAM roles
- Principle of least privilege (only access to what's necessary)
- Secrets injected as environment variables

**Rotation**:

- Automatic rotation for database passwords
- A Lambda function creates new credentials
- Gradual update of containers
- Zero downtime during rotation

### Network Security

**[See Diagram 4: Network and Security Flow](#diagram-4-network-and-security-flow)**

**Security Groups** (firewall rules):

```
Load Balancer:
  Inbound:  Port 443 from Internet (any IP)
  Outbound: Ports 3000, 4000 only to containers

Application Containers:
  Inbound:  Ports 3000, 4000 only from load balancer
  Outbound: Port 5432 only to database
            Port 443 to AWS services

Database:
  Inbound:  Port 5432 only from containers
  Outbound: None
```

**Network Isolation**:

- Public Subnets: Only load balancer and NAT gateways
- Private Subnets: Application containers (no direct internet access)
- Data Subnets: Database (completely isolated)

### Encryption

**In Transit** (data traveling):

- Internet → Load Balancer: TLS 1.3 with AWS certificate
- Load Balancer → Containers: HTTP (within secure private network)
- Containers → Database: Mandatory SSL/TLS
- Containers → AWS Services: HTTPS

**At Rest** (stored data):

- Database: AES-256 (KMS-managed key)
- Disks: Encrypted (KMS)
- S3 Backups: AES-256
- Secrets Manager: Encrypted (KMS)

### Application Security

**Authentication**: JWT with refresh tokens (15 min access, 7 day refresh)

**Authorization**: Role-based access control (RBAC)

**Rate Limiting**:

- Global: 100 requests per minute per IP
- Per endpoint: Configurable as needed

**CORS**: Restricted to allowed origins only

**Security Headers**:

- Helmet.js for secure HTTP headers
- Content Security Policy (CSP)
- HSTS enabled (1 year maximum)

### Audit and Compliance

**AWS CloudTrail**:

- All API calls logged to S3
- Log file validation enabled
- Retention: 90 days in CloudTrail, indefinite in S3

**RDS Audit Logs**:

- Connection/disconnection logging
- Query logging (testing only, for performance)

---

## References

- **[Architecture Documentation](./docs/architecture.md)**: Base layered architecture
- **[ADR-001](./docs/adr-001-architecture.md)**: Architectural Decision Record
- **[AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)**
- **[AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)**
