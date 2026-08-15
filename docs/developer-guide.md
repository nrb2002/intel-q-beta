# Intel-Q Developer Guide

**Project:** Intel-Q – Intelligent Queue Management System  
**Framework:** Next.js (App Router)  
**Language:** TypeScript  
**Database:** PostgreSQL + Prisma  
**Authentication:** Auth.js v5  
**Styling:** Tailwind CSS + shadcn/ui  
**Hosting:** Vercel

---

# Overview

Welcome to the Intel-Q development team!

This guide explains how to set up the local development environment, follow the team's coding standards, use GitHub effectively, and contribute to the project.

Following this guide helps ensure consistency, code quality, and smooth collaboration throughout the project.

---

# Technology Stack
```
_________________________________________________________
| Technology               | Purpose                    |
|--------------------------|----------------------------|
| Next.js 15+ (App Router) | Full-stack React framework |
| TypeScript               | Type safety                |
| Tailwind CSS             | Styling                    |
| shadcn/ui                | Reusable UI components     |
| PostgreSQL               | Relational database        |
| Prisma                   | ORM and type-safe database | 
|                          | access                     |
| Auth.js v5               | Authentication             |
| Vercel                   | Deployment                 |
| GitHub                   | Version Control            |
| GitHub Projects          | Project Management         |
 _______________________________________________________
```
---

# Local Development Setup

## Prerequisites

Before starting development, install:

- Node.js 20 or later
- npm
- Git
- VS Code
- Access to the Intel-Q GitHub repository
- Access to the team's PostgreSQL database



## 1. Clone the Repository

Clone the team's repository:

```bash
git clone https://github.com/nrb2002/intel-q.git

cd intel-q
```

## 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

If Prisma is not already installed, run:

```bash
npm install prisma @prisma/client
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
DATABASE_URL="postgresql://username:password@hostname:5432/intelq"

AUTH_SECRET="your-secret-key"

AUTH_URL="http://localhost:3000"
```

The exact `DATABASE_URL` will depend on the PostgreSQL provider selected by the team.

> **Important:** Never commit `.env.local` to GitHub. Environment variables must remain private.

Whenever a new environment variable is required, update `.env.example` without including actual secrets.

Example:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
```

---

## 4. Set Up the Database

After configuring `DATABASE_URL`, run the Prisma migration:

```bash
npx prisma migrate dev
```

If the project contains existing migrations, Prisma will apply the required migrations to the local database.

Generate the Prisma Client:

```bash
npx prisma generate
```

---

## 5. Start the Development Server

Run:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

# Project Structure

The project should follow a structure similar to:

```text
intel-q/
│
├── .github/
│   ├── workflows/
│   │   └── ...
│   └── ...
│
├── .specify/
│   └── ...
│
├── app/
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   │
│   │   ├── queues/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   ├── branches/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   └── users/
│   │       └── me/
│   │           └── route.ts
│   │
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── queue/
│   │   │   └── page.tsx
│   │   │
│   │   ├── branches/
│   │   │   └── page.tsx
│   │   │
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   │
│   ├── queue/
│   │   ├── QueueList.tsx
│   │   ├── QueueTicketCard.tsx
│   │   ├── QueueForm.tsx
│   │   └── QueueStatusBadge.tsx
│   │
│   ├── branch/
│   │   ├── BranchList.tsx
│   │   ├── BranchCard.tsx
│   │   └── BranchForm.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Dialog.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Toast.tsx
│   │
│   └── shared/
│       ├── EmptyState.tsx
│       ├── ErrorMessage.tsx
│       └── LoadingState.tsx
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
│
├── models/
│   ├── User.ts
│   ├── QueueTicket.ts
│   └── Branch.ts
│
├── services/
│   ├── queueService.ts
│   ├── branchService.ts
│   └── userService.ts
│
├── hooks/
│   └── ...
│
├── types/
│   ├── auth.ts
│   ├── queue.ts
│   ├── branch.ts
│   └── user.ts
│
├── utils/
│   └── ...
│
├── public/
│   └── ...
│
├── docs/
│   ├── architecture.md
│   ├── api-documentation.md
│   ├── constitution.md
│   ├── database-design.md
│   ├── design-theme-branding.md
│   ├── developer-guide.md
│   ├── deployment-guide.md
│   └── week-04-milestone.md
│
├── specs/
│   └── ...
│
├── templates/
│   └── ...
│
├── .env.example
├── .env.local
├── .gitignore
├── .prettierrc
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── board.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── spec-kit.yaml
└── tsconfig.json
```

---

# Directory Responsibilities

## `app/`

The `app/` directory is the primary Next.js App Router directory.

It contains:

* Public pages
* Authentication pages
* Dashboard pages
* Layouts
* API Route Handlers
* Global styles

The current repository already uses this root-level `app/` structure, so the team should **not move it to `src/app/`** unless the entire project is intentionally reorganized.

---

## `app/api/`

Contains Next.js Route Handlers that implement the server-side API.

Example:

```text
app/api/queues/route.ts
```

Responsibilities include:

* Handling HTTP requests
* Validating request data
* Checking authentication
* Calling service functions
* Reading and writing database records
* Returning typed responses

The API layer should not contain unnecessary UI logic.

---

## `app/dashboard/`

Contains authenticated application views.

The dashboard should provide different functionality depending on the authenticated user's role.

Possible roles include:

* Customer
* Staff
* Administrator

The MVP should prioritize the customer and staff queue workflows before implementing advanced administrator features.

---

## `components/`

Contains reusable React components.

Components should be grouped by responsibility rather than placing every component in one large directory.

For example:

```text
components/
├── auth/
├── branch/
├── layout/
├── queue/
├── shared/
└── ui/
```

Components should be reused across multiple pages whenever practical.

---

## `lib/`

Contains shared infrastructure and configuration.

Examples:

```text
lib/db.ts
lib/auth.ts
lib/utils.ts
```

Responsibilities include:

* Database connection
* Auth.js configuration
* Shared utility functions
* Common server-side helpers

---

## `models/`

Contains database models and schemas.

For the Intel-Q MVP, the core models are:

```text
models/
├── User.ts
├── QueueTicket.ts
└── Branch.ts
```

The models should reflect the team's approved database design.

Because the team has decided to use PostgreSQL, these should eventually be implemented using the selected PostgreSQL database access layer or ORM rather than Mongoose.

---

## `services/`

Contains server-side business logic.

Examples:

```text
services/
├── queueService.ts
├── branchService.ts
└── userService.ts
```

Services should handle operations such as:

* Creating queue tickets
* Retrieving active queues
* Updating ticket status
* Removing queue tickets
* Creating branches
* Updating branches

Keeping business logic in services helps prevent API Route Handlers from becoming too large.

---

## `types/`

Contains shared TypeScript types.

Examples:

```text
types/
├── auth.ts
├── queue.ts
├── branch.ts
└── user.ts
```

Shared types should be used for:

* Component props
* API request payloads
* API responses
* Database-related data
* Authentication data

Avoid using `any`.

---

## `hooks/`

Contains custom React hooks.

Hooks should only be created when reusable client-side behavior is needed.

Examples might include:

```text
useQueue.ts
useAuth.ts
useToast.ts
```

Do not create a custom hook simply to wrap a single function unless it provides meaningful reuse or abstraction.

---

## `utils/`

Contains general-purpose utility functions that do not belong specifically to database, authentication, or business logic.

Examples include:

* Formatting dates
* Formatting ticket numbers
* Validation helpers
* Display formatting

---

## `docs/`

Contains project documentation.

The current repository already has a dedicated `docs/` directory. This is the appropriate location for the team's architectural and development documentation.

Recommended documents include:

```text
docs/
├── architecture.md
├── api-documentation.md
├── constitution.md
├── database-design.md
├── design-theme-branding.md
├── developer-guide.md
├── deployment-guide.md
└── week-04-milestone.md
```

---

## `specs/`

Contains project specifications generated and maintained through the Spec-Kit workflow.

The team should keep the formal feature specification here rather than mixing specification documents with application source code.

---

## `.specify/`

Contains Spec-Kit configuration, templates, and supporting files.

This directory is generated and maintained as part of the Spec-Kit workflow. Team members should avoid manually deleting or restructuring it unless they understand the impact on the Spec-Kit tooling.

---

## `public/`

Contains static assets.

Examples:

```text
public/
├── images/
├── icons/
└── ...
```

Use this directory for assets that need to be publicly accessible.

---

# MVP Priority Structure

Because the team has **five members** and a limited development timeline, the following areas should receive the highest priority:

## Priority 1 – Application Foundation

```text
app/
lib/
types/
```

Establish:

* Next.js App Router
* Global layout
* Environment configuration
* Database connection
* Authentication foundation

## Priority 2 – Authentication

```text
app/login/
app/register/
components/auth/
lib/auth.ts
```

Implement:

* Registration
* Login
* Logout
* Protected routes
* Session handling

## Priority 3 – Queue Management

```text
app/dashboard/queue/
app/api/queues/
components/queue/
services/queueService.ts
```

Implement:

* Create queue ticket
* View active queue
* Update queue status
* Delete/cancel queue ticket

## Priority 4 – Shared UI

```text
components/layout/
components/ui/
components/shared/
```

Implement reusable:

* Header
* Sidebar
* Navigation
* Buttons
* Inputs
* Cards
* Status badges
* Loading states
* Error states
* Empty states

## Priority 5 – Branch Management

```text
app/dashboard/branches/
app/api/branches/
components/branch/
services/branchService.ts
```

Implement branch CRUD after the core queue workflow is functional.

---

# Recommended Development Order

The team should implement the project in approximately this order:

```text
1. Existing Next.js foundation
        ↓
2. Database configuration
        ↓
3. Core data models
        ↓
4. Authentication
        ↓
5. Shared design system
        ↓
6. Dashboard layout
        ↓
7. Queue API
        ↓
8. Queue UI
        ↓
9. Branch management
        ↓
10. Error and loading states
        ↓
11. Responsive design review
        ↓
12. Testing and code review
        ↓
13. Vercel deployment
```

This order ensures that the team establishes the technical foundation before building the main queue workflow.

---

# Important Repository Alignment Notes

The following points are important for keeping the documentation synchronized with the actual GitHub repository:

1. **Keep `app/` at the repository root.** The current project does not use `src/app/`.
2. **Keep project documentation under `docs/`.**
3. **Keep Spec-Kit files under `.specify/` and specification work under `specs/`.**
4. **Do not create duplicate documentation folders.**
5. **Do not introduce a second application root such as `src/` unless the team explicitly decides to migrate the project.**
6. **Update this structure whenever a major architectural decision changes.**
7. **Keep the README synchronized with the actual repository structure and setup instructions.**

---

# Definition of Done

The project structure is considered established when:

* The Next.js application runs successfully from the root-level `app/` directory.
* Shared components are organized under `components/`.
* Database infrastructure is organized under `lib/` and `models/` or the team's selected PostgreSQL data-access structure.
* Authentication configuration is centralized.
* Business logic is separated into services where appropriate.
* Shared TypeScript types are organized under `types/`.
* Project documentation is stored under `docs/`.
* Spec-Kit files remain organized under `.specify/` and `specs/`.
* Team members understand where new files should be created.
* No duplicate or conflicting project structures exist.
* The structure supports the Intel-Q MVP without unnecessary complexity.



---

# Git Workflow

## Create a Feature Branch

Always create a feature branch from the latest `main` branch with the name of the feature and the team-member who submitted it.

```bash
git checkout main
git pull origin main

git checkout -b feature/team-member
```

Examples:

```text
authentication/Sunday
database/Nompilo
developer-guide/Baron
```

Use one branch for one logical feature or issue whenever practical.

---

## Commit Changes

Use clear, descriptive commit messages.

Examples:

```text
feat: add queue ticket API

fix: resolve login redirect issue

docs: update developer guide

refactor: simplify Prisma database connection

style: improve dashboard layout

test: add queue API validation tests
```

Keep commits focused and avoid combining unrelated changes.

---

## Push Your Branch

Push your feature branch to GitHub:

```bash
git push origin developer-guide/Baron
```

Open a Pull Request and reference the related GitHub issue.

Example:

```text
Closes #6
```

---

# Pull Request Checklist

Before submitting a Pull Request:

* [ ] Acceptance criteria have been completed.
* [ ] Project builds successfully.
* [ ] No TypeScript errors exist.
* [ ] No ESLint errors exist.
* [ ] Feature has been manually tested.
* [ ] Responsive behavior has been verified.
* [ ] Related GitHub issue is referenced.
* [ ] Documentation has been updated if necessary.
* [ ] No secrets or environment variables have been committed.

At least one teammate should review and approve the Pull Request before merging.

---

# Coding Standards

## TypeScript

* Enable strict TypeScript mode.
* Avoid using `any`.
* Define interfaces or types for component props.
* Define types for API request and response data.
* Use Prisma-generated types where appropriate.
* Prefer explicit and descriptive types.
* Avoid unnecessary type assertions.

Example:

```ts
interface QueueTicket {
  id: string;
  ticketNumber: number;
  status: "WAITING" | "IN_SERVICE" | "COMPLETED" | "CANCELLED";
}
```

---

## React Components

* Use functional components.
* Prefer Server Components by default.
* Use Client Components only when interactivity, browser APIs, or client-side state is required.
* Keep components focused on a single responsibility.
* Extract repeated UI patterns into reusable components.
* Avoid unnecessarily large components.

---

## File Naming

| Item              | Convention              |
| ----------------- | ----------------------- |
| React Components  | PascalCase              |
| Hooks             | camelCase               |
| Utility files     | camelCase or kebab-case |
| Routes            | kebab-case              |
| Prisma schema     | `schema.prisma`         |
| Database client   | `prisma.ts`             |
| Types             | PascalCase              |
| API route folders | kebab-case              |

Examples:

```text
QueueCard.tsx
Header.tsx
useQueue.ts
queue-utils.ts
prisma.ts
schema.prisma
```

---

# Folder Responsibilities

## app/

Contains:

* Pages
* Layouts
* Loading states
* Error states
* API Route Handlers

---

## components/

Contains reusable UI and layout components.

Examples:

```text
Header
Sidebar
Footer
QueueCard
QueueStatusBadge
LoadingSpinner
EmptyState
```

---

## lib/

Contains shared infrastructure and configuration.

Examples:

```text
prisma.ts
auth.ts
```

---

## prisma/

Contains the Prisma database schema and migration-related files.

Primary file:

```text
prisma/schema.prisma
```

---

## services/

Contains reusable server-side business logic and database operations when separating business logic from Route Handlers is appropriate.

---

## hooks/

Contains reusable React Client Hooks.

Examples:

```text
useQueue.ts
useAuth.ts
```

---

## types/

Contains shared TypeScript types that are reused across multiple parts of the application.

---

## utils/

Contains small reusable helper functions.

---

# Database Guidelines

Intel-Q uses **PostgreSQL** as its primary database and **Prisma** as the ORM.

The core MVP data models are:

* User
* QueueTicket
* Branch

The primary relationships are:

```text
User
  │
  │ 1
  │
  │ *
QueueTicket
  │
  │ *
  │
  │ 1
Branch
```

A user can have multiple queue tickets.

A branch can have multiple queue tickets.

Each queue ticket belongs to one customer and one branch.

---

## Prisma Guidelines

Use Prisma for database access.

Example:

```ts
const tickets = await prisma.queueTicket.findMany({
  where: {
    status: "WAITING",
  },
});
```

Database operations should remain on the server.

Do not expose the Prisma Client directly to browser-side Client Components.

Use:

* Server Components
* Route Handlers
* Server Actions
* Server-side service functions

for database operations.

---

## Database Schema Changes

When modifying `schema.prisma`, create a migration:

```bash
npx prisma migrate dev --name describe-your-change
```

Example:

```bash
npx prisma migrate dev --name add_queue_ticket_status
```

After modifying the schema, regenerate Prisma Client:

```bash
npx prisma generate
```

Commit the migration files to GitHub.

Do not manually modify the production database without documenting the change.

---

# Authentication

Intel-Q uses **Auth.js v5** for authentication.

Protected pages should verify authentication on the server.

Authentication and authorization logic should remain on the server whenever possible.

Never expose:

* Database credentials
* Auth secrets
* Password hashes
* Private environment variables

to Client Components or browser code.

Role-based access should be enforced server-side.

Example roles:

```text
CUSTOMER
STAFF
ADMIN
```

---

# Styling Guidelines

Use:

* Tailwind CSS
* shadcn/ui
* The project's defined design theme

Avoid custom CSS unless absolutely necessary.

Maintain consistent:

* Colors
* Typography
* Spacing
* Borders
* Shadows
* Component styles

Refer to:

```text
docs/design-theme-branding.md
```

for the project's approved visual design.

---

# Responsive Design

Intel-Q must support:

* Mobile
* Tablet
* Desktop

Use Tailwind responsive utilities:

```text
sm:
md:
lg:
xl:
```

Test layouts at multiple screen sizes before submitting a Pull Request.

Prioritize mobile usability for customer-facing queue interactions.

---

# Error Handling

Every user-facing form should provide:

* Input validation
* Loading states
* Success feedback
* Error messages
* Empty states

API Route Handlers should return appropriate HTTP status codes.

Common examples:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Errors should provide useful feedback without exposing sensitive implementation details.

---

# API Guidelines

API Route Handlers should:

1. Validate authentication when required.
2. Validate incoming data.
3. Perform database operations on the server.
4. Return appropriate HTTP status codes.
5. Return consistent response structures.
6. Handle unexpected errors gracefully.

Core API areas include:

```text
/api/auth
/api/queues
/api/branches
/api/users
```

Refer to the project specification for the complete API design.

---

# Testing

Before opening a Pull Request:

* [ ] Verify the application builds successfully.
* [ ] Run the linter.
* [ ] Test the feature manually.
* [ ] Confirm no console errors.
* [ ] Verify responsive behavior.
* [ ] Test authentication if applicable.
* [ ] Test database operations if applicable.
* [ ] Test error and empty states.

Run:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

Critical workflows should receive automated tests whenever practical.

High-priority flows include:

* User registration
* User authentication
* Queue creation
* Queue retrieval
* Queue status updates
* Queue deletion
* Branch management

---

# GitHub Project Workflow

Move issues through the following workflow:

```text
Backlog
   ↓
Ready
   ↓
In Progress
   ↓
In Review
   ↓
Done
```

Keep GitHub issue status updated as work progresses.

Each issue should have:

* Clear description
* Acceptance criteria
* Priority
* Assigned owner
* Appropriate labels
* Related milestone when applicable

---

# Branch Protection

Do not commit directly to `main`.

Always:

1. Create a feature branch.
2. Implement the assigned issue.
3. Test your changes.
4. Push your branch.
5. Open a Pull Request.
6. Request a teammate review.
7. Address review feedback.
8. Merge after approval.

---

# Definition of Done

A task is considered complete when:

* [ ] Acceptance criteria are met.
* [ ] Code follows project standards.
* [ ] Feature has been tested.
* [ ] Error and loading states are handled.
* [ ] Responsive behavior has been verified.
* [ ] Documentation is updated if applicable.
* [ ] Pull Request has been reviewed.
* [ ] Pull Request has been approved and merged.
* [ ] Related GitHub issue is closed.
* [ ] GitHub Project Board is updated.

---

# Common Commands

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

---

## Run Linter

```bash
npm run lint
```

---

## Create Production Build

```bash
npm run build
```

---

## Start Production Server

```bash
npm run start
```

---

## Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## Create a Named Prisma Migration

```bash
npx prisma migrate dev --name migration_name
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Open Prisma Studio

```bash
npx prisma studio
```

---

# Troubleshooting

## PostgreSQL Connection Errors

Check:

* `DATABASE_URL` exists in `.env.local`.
* Database credentials are correct.
* PostgreSQL database is running.
* Your IP address is allowed if using a hosted database.
* The database provider is available.

---

## Prisma Errors

Try:

```bash
npx prisma generate
```

If the database schema has changed:

```bash
npx prisma migrate dev
```

Check the Prisma schema:

```text
prisma/schema.prisma
```

---

## Authentication Issues

Check:

* `AUTH_SECRET` is configured.
* Auth.js configuration is correct.
* Database access is working.
* Callback and redirect behavior is correct.
* Protected routes correctly check the user's session.

---

## Build Errors

Run:

```bash
npm run lint
```

Then:

```bash
npm run build
```

Resolve all TypeScript and ESLint errors before opening a Pull Request.

If environment variables were changed, restart the development server:

```bash
npm run dev
```

---

# Team Communication

Team members should:

* Keep GitHub issues updated.
* Communicate blockers early.
* Review teammates' Pull Requests promptly.
* Ask questions when requirements are unclear.
* Document significant architectural decisions.
* Keep the GitHub Project Board current.
* Communicate changes that affect authentication, database models, APIs, or shared components.

Architectural decisions should be documented in the `docs/` directory.

---

# Additional Documentation

Refer to the following project documents:

* `README.md`
* `specs/intel-q-spec.md`
* `docs/architecture.md`
* `docs/deployment-guide.md`
* `docs/developer-guide.md`
* `docs/database-design.md`
* `docs/ui-theme--and-branding.md`
* `docs/milestones/`

These documents provide the project's technical standards, architecture, database design, visual design, and implementation roadmap.

---

# Final Notes

Intel-Q is being developed as a collaborative, production-style application.

The team should prioritize:

* Simplicity
* Reliability
* Security
* Accessibility
* Maintainability
* Consistent user experience

With a limited development timeline, the team should focus on completing the MVP before implementing optional enhancements.

All team members are responsible for maintaining code quality, communicating blockers, participating in code reviews, and keeping project documentation current.

The goal is to deliver a stable and functional Intel-Q MVP that demonstrates effective full-stack development and professional team collaboration.
