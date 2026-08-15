# Intel-Q Deployment Guide

## 1. Purpose

This guide explains how to deploy the Intel-Q queue management application from the existing Next.js development project to a production environment.

The deployment target should support:

- Next.js application hosting
- PostgreSQL
- Prisma ORM
- HTTPS
- Environment variables
- Production authentication
- Server-side API routes
- Persistent database storage

The recommended first production target is **Vercel + managed PostgreSQL** because Intel-Q is already built as a Next.js application.

---

# 2. Production Architecture

```text
Customer Phone / iPad
        |
        | HTTPS
        v
+-----------------------+
|   Intel-Q Next.js     |
|       Application     |
|                       |
| Customer Services     |
| Customer Display      |
| Staff Interface       |
| Admin Interface       |
| API Routes            |
+-----------+-----------+
            |
            | Prisma
            v
+-----------------------+
| Managed PostgreSQL    |
|                       |
| Users                 |
| Branches              |
| Services              |
| Windows               |
| Tickets               |
| Ticket history        |
+-----------------------+
```

The application should not expose PostgreSQL directly to customers or staff. All database access must go through the server-side application and Prisma.

---

# 3. Prerequisites

Before deploying, make sure the following are available:

- GitHub repository containing the Intel-Q project
- Node.js LTS
- npm
- Production PostgreSQL database
- Vercel account or another Next.js-compatible hosting provider
- Production domain, if available
- GitHub repository connected to the deployment platform

Verify locally:

```bash
node -v
npm -v
git --version
```

Install dependencies:

```bash
npm install
```

---

# 4. Verify the Project Before Deployment

Run the production build locally.

```bash
npm run build
```

The build must complete successfully.

Also run:

```bash
npm run lint
```

If the project contains tests:

```bash
npm test
```

Do not deploy while TypeScript errors, ESLint errors, failed tests, or Prisma generation errors remain unresolved.

---

# 5. PostgreSQL Production Database

Create a managed PostgreSQL database.

The database provider may be:

- Vercel Postgres
- Neon
- Supabase
- Railway
- Render PostgreSQL
- another trusted managed PostgreSQL provider

The production database must provide a PostgreSQL connection string.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Do not commit this value to Git.

---

# 6. Configure Prisma

Confirm that Prisma is configured to use PostgreSQL.

The Prisma datasource should resemble:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Generate Prisma Client:

```bash
npx prisma generate
```

For production schema deployment, use:

```bash
npx prisma migrate deploy
```

Do not use:

```bash
npx prisma migrate dev
```

against the production database.

---

# 7. Create a Production Environment File

For local production testing, create:

```text
.env.production
```

Never commit this file if it contains secrets.

Typical variables include:

```env
DATABASE_URL="your-production-postgresql-url"

AUTH_SECRET="your-production-auth-secret"

NEXTAUTH_URL="https://your-domain.example"

NODE_ENV="production"
```

The exact authentication variables must match the authentication implementation used by the project.

If the application uses Auth.js/NextAuth, configure the variables required by the installed version and authentication adapter.

---

# 8. Generate a Secure Authentication Secret

The production authentication secret must be different from development secrets.

A suitable random secret can be generated with:

```bash
openssl rand -base64 32
```

Example:

```env
AUTH_SECRET="GENERATED_SECRET"
```

Do not:

- reuse a public example secret
- commit the secret
- put the secret in frontend code
- share it in GitHub issues

---

# 9. Configure Vercel

Create or open the Vercel project.

Import the GitHub repository:

```text
nrb2002/intel-q
```

Vercel should detect Next.js automatically.

Recommended settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: Next.js default
Node.js Version: LTS
```

Do not manually configure an output directory unless the project specifically requires it.

---

# 10. Add Production Environment Variables

In the Vercel project:

```text
Project Settings
    >
Environment Variables
```

Add all required production variables.

At minimum, verify:

```env
DATABASE_URL
AUTH_SECRET
NEXTAUTH_URL
```

If the application uses other services, add their production credentials as well.

Set variables for:

```text
Production
```

Development and Preview variables should be configured separately when appropriate.

---

# 11. Prisma Build Configuration

The production build must generate Prisma Client.

A safe package configuration is:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

If Prisma is already generated through another mechanism, do not duplicate the command unnecessarily.

The important requirement is that Prisma Client exists during the Next.js production build.

---

# 12. Database Migration Strategy

Before the first production deployment:

1. Back up the production database if it already contains data.
2. Confirm the Prisma schema.
3. Confirm all migration files exist in Git.
4. Test the migrations against a staging database.
5. Deploy migrations.

Run:

```bash
npx prisma migrate deploy
```

For an existing project, inspect migrations:

```bash
npx prisma migrate status
```

Do not modify production tables manually unless there is a documented migration strategy.

---

# 13. Initial Production Data

Intel-Q requires some initial operational data before staff can use it.

The initial setup should include:

- Administrator account
- Staff accounts
- Branches
- Services
- Queue/status configuration
- Windows

For example:

```text
Branch
  Consular Section

Services
  Citizen Services
  Immigrant Visas
  Non-immigrant Visas
  Notarials
  Official/Diplomatic Visas

Windows
  Window 1
  Window 2
  Window 3
  Window 4
```

The exact production configuration should be created through the application's administrative interface when those features are available.

---

# 14. Administrator Account

The production system must have at least one administrator.

The administrator should be able to:

- sign in
- manage staff
- manage branches
- manage services
- manage windows
- configure queue availability
- review operational information

Do not create production administrators by exposing a public registration endpoint.

If a seed script is used, ensure that it is protected and that production credentials are supplied through environment variables.

---

# 15. Customer Endpoint

The customer must not need an account.

The customer-facing flow should be:

```text
Welcome Page
      |
      v
Services Page
      |
      v
Select Service
      |
      v
Enter First Name
      |
      v
Print / Download Ticket
```

The customer-facing page must not expose:

- staff controls
- admin controls
- database credentials
- internal ticket-management actions
- authentication secrets

---

# 16. QR Code Deployment

The welcome page should provide:

- the Services page URL
- a QR code pointing to the Services page

Example production URL:

```text
https://intel-q.example.com/services
```

The QR code should be tested using multiple phones before deployment.

Test:

1. Scan the QR code.
2. Open the Services page.
3. Select a service.
4. Enter a first name.
5. Generate a ticket.
6. Verify that the ticket appears in the staff interface.

---

# 17. Staff Interface

Staff should have a dedicated authenticated route.

Example:

```text
/login/staff
```

The staff interface should allow authorized staff to:

- select or work at a window
- see pending tickets
- call the next ticket
- see the current ticket
- advance the ticket
- place the ticket on hold
- return an on-hold ticket when appropriate
- complete/destroy a ticket when service is finished

Every staff operation must be authorized on the server.

Hiding a button in the UI is not sufficient security.

---

# 18. Admin Interface

Administrators should have a separate authenticated route.

Example:

```text
/login/admin
```

Administrative operations should be protected by role checks.

Example roles:

```text
STAFF
ADMIN
```

Do not trust a role supplied by the browser.

The server must obtain the authenticated user's role from the trusted session/database context.

---

# 19. Customer Display

The customer display should run on a dedicated screen.

Example:

```text
/display
```

It should show:

```text
NOW SERVING

A-104

Window 3
```

and a list of recently called tickets.

The display should also provide an audible announcement when a ticket is called.

Example announcement:

```text
Ticket A-104, please proceed to Window 3.
```

The display should not require customer authentication.

---

# 20. Real-Time Communication

The customer display needs timely updates when staff call tickets.

The implementation may use:

- polling
- Server-Sent Events
- WebSockets
- another real-time mechanism

For the first production version, simple polling is acceptable if the traffic is small.

For example:

```text
GET /api/display
```

every few seconds.

If real-time infrastructure is later introduced, it should replace polling without changing the underlying ticket model.

---

# 21. Ticket Lifecycle

The production workflow should support a ticket moving through multiple queue states.

Example:

```text
INTAKE
   |
   +----> ON_HOLD
   |
   v
INTERVIEW
   |
   v
PAYMENT
   |
   v
DELIVERY
   |
   v
COMPLETED
```

A ticket may move backward when operationally necessary.

For example:

```text
INTERVIEW
    |
    v
ON_HOLD
    |
    v
INTERVIEW
```

The server must validate permitted state transitions.

---

# 22. Ticket Timing

Every transition should have a timestamp.

The system should be able to calculate:

```text
Ticket created
      |
      v
Time waiting for Intake
      |
      v
Intake started
      |
      v
Time waiting for Interview
      |
      v
Interview started
      |
      v
...
      |
      v
Completed
```

Store timestamps in UTC.

Convert them to the appropriate local timezone only for display/reporting.

Do not calculate important historical durations solely in the browser.

---

# 23. Ticket Destruction

When the final staff member completes a ticket, the operational ticket may be removed from the active queue.

However, the project should preserve the information needed for historical analysis.

Therefore distinguish between:

```text
Active ticket
```

and:

```text
Historical ticket information
```

Do not permanently delete analytical information merely because the ticket disappears from the active customer/staff queue.

If the existing data model does not yet support historical ticket events, this should be addressed before production analytics are considered complete.

---

# 24. Security Checklist

Before production deployment verify:

- [ ] HTTPS is enabled.
- [ ] Database credentials are not committed.
- [ ] Authentication secrets are not committed.
- [ ] `.env` files containing secrets are ignored by Git.
- [ ] Staff routes require authentication.
- [ ] Admin routes require authentication.
- [ ] API routes perform server-side authorization.
- [ ] Customer endpoints do not require accounts.
- [ ] Passwords are hashed.
- [ ] Production uses a strong authentication secret.
- [ ] Prisma does not expose database credentials to the browser.
- [ ] Error messages do not expose stack traces to users.
- [ ] Sensitive information is not logged.
- [ ] Database backups are configured.

---

# 25. GitHub Configuration

Confirm that the repository does not contain:

```text
.env
.env.local
.env.production
```

with real credentials.

A suitable `.gitignore` should include:

```gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

Never commit:

```text
DATABASE_URL
AUTH_SECRET
API keys
private keys
production passwords
```

---

# 26. Production Build Test

Before pushing the final production version:

```bash
npm install
npx prisma generate
npm run lint
npm run build
```

Then test the production server locally where possible:

```bash
npm start
```

Verify:

```text
/login
/customer/services
/display
/staff
/admin
/api/auth/*
/api/branches
```

Use the actual routes implemented by the application.

---

# 27. Deployment

Commit the verified application:

```bash
git add .
git commit -m "Prepare Intel-Q for production deployment"
git push origin main
```

Vercel should automatically create a deployment.

After deployment:

1. Open the production URL.
2. Test authentication.
3. Test customer ticket creation.
4. Test staff ticket calling.
5. Test customer display.
6. Test voice announcements.
7. Test ticket transitions.
8. Test ticket completion.
9. Test database persistence.

---

# 28. Smoke Test

Perform the following end-to-end test immediately after deployment.

### Customer

- [ ] Open the welcome page.
- [ ] Scan the QR code.
- [ ] Open Services.
- [ ] Select a service.
- [ ] Enter a first name.
- [ ] Print/download a ticket.
- [ ] Confirm the ticket number.

### Staff

- [ ] Sign in as staff.
- [ ] Select a window.
- [ ] Find the customer's ticket.
- [ ] Call the ticket.
- [ ] Confirm the customer display updates.
- [ ] Confirm the voice announcement plays.
- [ ] Move the ticket to the next queue/status.

### Next Window

- [ ] Open the relevant queue.
- [ ] Find the pending ticket.
- [ ] Call it.
- [ ] Confirm the display shows the correct window.
- [ ] Change the ticket status.

### Completion

- [ ] Complete the final service.
- [ ] Confirm the ticket disappears from active queues.
- [ ] Confirm historical timing information remains available if supported.

---

# 29. Mobile Testing

Because customers may use personal phones, test at least:

- Android Chrome
- Android Firefox
- iPhone Safari
- iPhone Chrome

Verify:

- QR code opens correctly.
- Services page is responsive.
- Buttons are large enough to touch.
- Ticket can be downloaded.
- Ticket remains readable.
- No authentication is required.

---

# 30. Touchscreen/iPad Testing

For a waiting-room touchscreen:

- test landscape and portrait layouts
- use large touch targets
- prevent accidental double submissions
- ensure the ticket-generation button provides clear feedback
- verify the screen can return to the Services page after ticket creation

The customer interface should be usable without a keyboard.

---

# 31. Display Screen Testing

Test the display on the actual screen or TV/browser intended for deployment.

Verify:

- ticket number is readable from a distance
- window number is clearly visible
- current ticket is visually prominent
- recent calls are distinguishable
- voice announcement is audible
- the display automatically updates
- the screen recovers after a network interruption

---

# 32. Network Failure Testing

Test what happens when the network is interrupted.

Customer:

```text
Network lost
    |
    v
Clear error message
    |
    v
Retry
```

Staff:

```text
API unavailable
    |
    v
Do not silently lose the action
```

Display:

```text
Connection interrupted
    |
    v
Automatically retry
```

Do not allow a failed network request to appear as a successful ticket operation.

---

# 33. Database Backup

Production PostgreSQL must have backups enabled.

At minimum:

- automated backups
- retention policy
- restore procedure
- access restricted to authorized administrators

A backup is only useful if restoration is possible.

Perform a test restoration before the system is considered production-ready.

---

# 34. Monitoring

Monitor:

- application errors
- failed API requests
- database errors
- authentication failures
- deployment failures
- response times

Vercel logs can be used for initial application monitoring.

For larger deployments, introduce a dedicated error-monitoring service.

---

# 35. Logging Rules

Logs should help diagnose operational problems without exposing sensitive data.

Good:

```text
Ticket transition failed for ticket ID abc123
```

Avoid:

```text
Password: ...
DATABASE_URL: ...
AUTH_SECRET: ...
```

Never log customer passwords or authentication secrets.

---

# 36. Rollback Procedure

If a deployment breaks production:

1. Stop making additional changes.
2. Identify the failed deployment.
3. Check application logs.
4. Determine whether the failure is application or database related.
5. Roll back the application deployment if appropriate.
6. Do not automatically roll back database migrations unless the migration strategy explicitly supports it.
7. Verify customer and staff workflows after rollback.

Database migrations require additional care because schema changes may not be safely reversible.

---

# 37. Production Environment Separation

Maintain separate environments:

```text
Development
    |
    v
Preview/Staging
    |
    v
Production
```

Do not use the production database during development.

Recommended:

```text
intel-q-dev
intel-q-staging
intel-q-production
```

---

# 38. Deployment Checklist

## Application

- [ ] Production build succeeds.
- [ ] TypeScript is clean.
- [ ] ESLint is clean.
- [ ] Tests pass.
- [ ] Prisma Client generates correctly.
- [ ] No development-only code is enabled.

## Database

- [ ] PostgreSQL production database exists.
- [ ] `DATABASE_URL` is configured.
- [ ] Prisma migrations are deployed.
- [ ] Backups are enabled.
- [ ] Initial administrative data exists.

## Authentication

- [ ] Staff login works.
- [ ] Admin login works.
- [ ] Unauthorized users are blocked.
- [ ] Roles are enforced server-side.
- [ ] Production authentication secret is configured.

## Customer

- [ ] No account is required.
- [ ] First name is required.
- [ ] Service selection works.
- [ ] Ticket generation works.
- [ ] Ticket printing works.
- [ ] Ticket downloading works.
- [ ] QR code works.

## Staff

- [ ] Staff can select/work at a window.
- [ ] Pending tickets are visible.
- [ ] Ticket calling works.
- [ ] Status changes work.
- [ ] On-hold workflow works.
- [ ] Completed tickets leave active queues.

## Display

- [ ] Display route is accessible.
- [ ] Current ticket updates.
- [ ] Window number updates.
- [ ] Voice announcement works.
- [ ] Automatic refresh/reconnection works.

## Security

- [ ] HTTPS works.
- [ ] Secrets are protected.
- [ ] API authorization works.
- [ ] Sensitive information is not exposed.
- [ ] Production database is not publicly accessible.

---

# 39. Recommended First Production Release

The first release should prioritize operational reliability over advanced features.

### Must work

```text
Customer
    |
    v
Services
    |
    v
First Name
    |
    v
Ticket
    |
    v
Staff
    |
    v
Call
    |
    v
Customer Display
    |
    v
Next Status
    |
    v
Final Completion
```

### Can come later

- advanced analytics
- sophisticated reporting
- multi-branch administration
- configurable branding
- advanced notifications
- SMS/email integration
- subscription/billing
- advanced real-time infrastructure

The goal of the first production release is to provide a stable digital queue workflow that can be used in a real service environment.

---

# 40. Definition of Done

Intel-Q is ready for initial production deployment when:

- the application builds successfully
- the production database is connected
- Prisma migrations are deployed
- staff authentication works
- administrator authentication works
- customers can obtain tickets without creating accounts
- customers must provide a first name
- staff can call tickets
- ticket status can progress through multiple queues
- customer displays update correctly
- voice announcements work
- final tickets leave active queues
- required historical timing data is retained
- production secrets are secured
- backups are configured
- the complete customer-to-completion workflow has been tested successfully

---

# 41. Post-Deployment Procedure

After the first successful deployment:

1. Keep the system under observation.
2. Test the first real operational session carefully.
3. Record any workflow problems.
4. Do not make unrelated feature changes during the initial stabilization period.
5. Fix production-critical issues first.
6. Document operational procedures for staff.
7. Schedule a post-launch review.

The first deployment should establish a stable foundation for subsequent improvements rather than attempting to deliver every possible feature at once.
