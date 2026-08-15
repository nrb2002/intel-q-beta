# Milestone 01 — Project Foundation & Refactoring

## Objective
Prepare the existing Intel-Q template for the new queue-management workflow without unnecessarily rewriting working functionality.

## Scope
- Verify Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, authentication, and existing validation.
- Review the current project structure.
- Preserve working authentication and branch functionality where reusable.
- Remove or isolate obsolete customer-account assumptions from the public ticket workflow.
- Establish consistent component, API, validation, and route conventions.
- Ensure the application builds cleanly before feature development.

## Tasks
- [ ] Review `package.json` and existing dependencies.
- [ ] Verify environment variables and database connectivity.
- [ ] Verify Prisma schema and migrations.
- [ ] Run the existing application and identify baseline issues.
- [ ] Run TypeScript/build checks and record existing errors.
- [ ] Review `lib/`, `app/`, and `components/` structure.
- [ ] Preserve reusable branch components and APIs.
- [ ] Establish folders for customer, staff, admin, ticket, queue, and display functionality as needed.
- [ ] Confirm consistent error-response patterns.
- [ ] Confirm Zod validation conventions.
- [ ] Confirm the existing authentication infrastructure can support separate staff/admin entry points.

## Acceptance Criteria
- [ ] Application starts successfully.
- [ ] PostgreSQL/Prisma connection works.
- [ ] Existing authentication remains functional.
- [ ] Existing branch functionality is not unnecessarily broken.
- [ ] TypeScript/build baseline is documented.
- [ ] Project structure is ready for the remaining milestones.

## Deliverables
- Clean project foundation.
- Updated project structure.
- Working database connection.
- Baseline build with known issues resolved or documented.


# Milestone 01 implementation order

1. Baseline the existing project
2. Verify environment and PostgreSQL
3. Verify Prisma
4. Run TypeScript/build checks
5. Review authentication
6. Review branch functionality
7. Clean obsolete customer-account assumptions
8. Establish the new folder structure
9. Standardize API/validation conventions
10. Run a final build and document the baseline
