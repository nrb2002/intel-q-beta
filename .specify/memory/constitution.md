# Intel-Q Constitution

## Purpose
Intel-Q is an intelligent queue management system designed for banks, hospitals, pharmacies, consulates, and other service-oriented organizations. The product must be dependable, secure, accessible, and easy to operate in real-world, high-volume environments while delivering an excellent experience for both customers and staff.

---

# Governing Principles

## I. Reliability Through Simplicity
Favor simple, well-understood solutions over unnecessary complexity. Build for predictable behavior, clear recovery paths, and maintainable code that the entire team can understand and support.

## II. Type Safety and Maintainability
All application code must use TypeScript with strict settings. Shared models, API inputs, outputs, and data flows must be explicitly typed. Avoid implicit `any`, unsafe casts, and ambiguous interfaces.

## III. Consistent and Accessible User Experience
The application must provide a polished, accessible, and consistent experience across desktop, tablet, and mobile devices. Tailwind CSS is the primary styling approach, emphasizing utility-first development over custom CSS unless a reusable design-system pattern requires otherwise. Reusable UI components should always be preferred over duplicated implementations.

## IV. Server-First Next.js Architecture
The application must use Next.js with the App Router as its primary architecture. Server Components are the default choice. Client Components should only be used when interactivity, browser APIs, or local state require them. Route Handlers and Server Actions should encapsulate business logic and data mutations whenever appropriate.

## V. Security and Privacy by Default
Authentication and authorization must be implemented using Auth.js v5. Sensitive operations must remain on the server, and secrets must only be stored in environment variables. Protect customer information, user accounts, queue tickets, and organizational data through secure development practices and role-based access control.

## VI. Data Integrity and Persistence
MongoDB is the system of record for operational data. Data models should be clearly defined, validated, and designed around the lifecycle of users, queue tickets, branches, and service records. Avoid unnecessary duplication and keep persistence logic intentional and maintainable.

## VII. Quality Through Verification
Features affecting authentication, queue management, data persistence, or the user experience must be verified before release. Automated tests should be written whenever practical, and all critical user journeys must successfully pass a documented manual smoke test prior to deployment.

## VIII. Production Readiness
The application should be deployable to Vercel at any time. Configuration, environment variables, and runtime assumptions must remain compatible with production environments throughout development.

## IX. MVP First
The team will prioritize the smallest set of features that delivers clear value to users. Features outside the agreed Minimum Viable Product (MVP) will be tracked in a Phase 2 backlog and will not delay delivery of the first working version.

---

# Stack and Engineering Standards

## TypeScript Standards

- Enable TypeScript strict mode.
- Never use implicit or explicit `any` unless there is an exceptional, documented reason.
- Prefer explicit interfaces and types for shared models, props, API payloads, and responses.
- Keep shared types in a central, discoverable location.
- Favor small, composable functions over deeply nested logic.
- Use descriptive names for models, components, handlers, and variables.

---

## Tailwind CSS Conventions

- Tailwind CSS is the primary styling solution.
- Favor utility-first development.
- Use reusable UI components instead of duplicating styling across pages.
- Avoid custom CSS unless it supports the shared design system or solves a complex visual requirement.
- Maintain consistent spacing, typography, colors, and responsive layouts throughout the application.

---

## Next.js Guidelines

- Use the App Router for routing and layout composition.
- Prefer Server Components by default.
- Use Client Components only when browser APIs, event handlers, or local state are required.
- Keep Route Handlers focused on server-side business logic.
- Use Server Actions for mutations when appropriate.
- Explicitly provide loading, error, and empty states for user-facing pages.

---

## Data and Authentication Standards

- Use MongoDB with Mongoose for data persistence.
- Validate all incoming data before writing to the database.
- Implement authentication and session management using Auth.js v5.
- Apply role-based authorization consistently across protected routes.
- Never expose secrets or sensitive business logic to the client.

---

# Design System

## Branding

Maintain a consistent visual identity across the application.

### Color Palette

- Primary: Royal Blue
- Secondary: Emerald Green
- Accent: Amber
- Neutral grayscale for backgrounds and typography

### Typography

- Use a consistent type scale throughout the application.
- Limit the number of font sizes and font weights.
- Prioritize readability over decoration.

### Components

The design system should provide reusable components including, but not limited to:

- Navbar
- Sidebar
- Footer
- Button
- Form Input
- Card
- Modal
- Queue Status Card
- Loading Spinner
- Notification/Toast

Components should be reused across pages whenever possible instead of creating page-specific versions.

---

# Accessibility Standards

Every user interface should follow modern accessibility best practices.

- Use semantic HTML.
- Support keyboard navigation.
- Maintain sufficient color contrast.
- Provide descriptive labels for form controls.
- Use ARIA attributes only when semantic HTML is insufficient.
- Ensure responsive layouts work well across desktop, tablet, and mobile devices.

---

# Testing Expectations

- Verify every completed feature before merging.
- Prioritize testing authentication, queue management, and CRUD operations.
- Write automated tests for business logic whenever practical.
- Perform a documented smoke test before each deployment.
- Resolve critical defects before merging into the main branch.

---

# Naming Conventions

- Use domain-driven names that reflect the business.
- Use **PascalCase** for React components and TypeScript types.
- Use **camelCase** for variables, functions, hooks, and object properties.
- Use **kebab-case** for file names, route segments, and folders where appropriate.
- Avoid vague names such as `data`, `temp`, `test`, or `thing`.

---

# Git Workflow

The project follows a GitHub feature-branch workflow.

- Every new feature begins with a GitHub Issue.
- Each issue has one primary owner.
- Development occurs in feature branches.
- Every Pull Request should receive at least one peer review before merging.
- Pull Requests should remain small, focused, and easy to review.
- The `main` branch must always remain deployable.
- GitHub Projects serves as the team's single source of truth for sprint planning and task tracking.

---

# Team Collaboration Guidelines

- Keep commits small, meaningful, and descriptive.
- Communicate changes affecting authentication, data models, deployment, or queue workflows.
- Document important architectural decisions within the repository.
- Review code with attention to accessibility, security, maintainability, and performance.
- Raise blockers early rather than waiting until the end of a sprint.
- Respect the agreed MVP scope and avoid unnecessary feature expansion during active development.

---

# Governance

This constitution serves as the authoritative guide for engineering, architecture, and collaboration decisions within Intel-Q.

Any exception to these principles must:

1. Be documented.
2. Include a clear technical justification.
3. Be reviewed and approved by at least one teammate before implementation.

---

**Version:** 2.0.0  
**Ratified:** 2026-07-12  
**Last Amended:** 2026-07-12
