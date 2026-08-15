# Week 04 Milestone – MVP Foundation

## Objective

The goal of Week 04 is to establish the core foundation of the Intel-Q application. By the end of this milestone, the team should have a working project structure, authentication, database connectivity, reusable UI components, and the initial queue management backend in place. This foundation will support feature development in the following weeks.

---

## Milestone Goals

- Set up the Next.js application with the required technology stack.
- Configure MongoDB and create the core data models.
- Implement user authentication with Auth.js v5.
- Build the shared application layout and reusable UI components.
- Develop the initial Queue Ticket API with CRUD operations.
- Ensure all work follows the project's coding standards and GitHub workflow.

---


## Included Issues

### Issue #1 – Project Setup and Development Environment (P1)

**Owner:** Team Member 2 - Elohim Baron Tshibasu

**Description**

Initialize the Intel-Q project using Next.js App Router, TypeScript, and Tailwind CSS. Configure the development environment and establish the project's folder structure.

**Deliverables**

- Next.js project initialized
- TypeScript strict mode enabled
- Tailwind CSS configured
- ESLint configured
- Initial folder structure created

---

### Issue #2 – Configure MongoDB and Create Data Models (P1)

**Owner:** Team Member 3 - Nompilo Ngwenya

**Description**

Configure MongoDB using Mongoose and implement the application's core data models.

**Deliverables**

- MongoDB connection established
- User model
- Queue Ticket model
- Branch model
- Schema validation

---

### Issue #3 – Implement Authentication with Auth.js v5

**Owner:** Team Member 4 - Sunday Victor Okoromoni

**Description**

Implement secure user authentication and authorization.

**Deliverables**

- User registration
- Login
- Logout
- Session management
- Protected routes

---

### Issue #4 – Build Shared Layout and Navigation Components

**Owner:** Team Member 1 - Maisela Manhla Madise

**Description**

Develop reusable layout components that provide a consistent user experience throughout the application.

**Deliverables**

- Header
- Sidebar
- Footer
- Navigation
- Protected Layout

---

### Issue #5 – Build Shared UI Component Library

**Owner:** Team Member 5 - Derick Shanana

**Description**

Create reusable UI components using Tailwind CSS and shadcn/ui.

**Deliverables**

- Button
- Input
- Card
- Badge
- Modal
- Loading Spinner
- Toast Notification

---

### Issue #6 – Implement Queue Ticket API

**Owner:** Team Member 2 - Baron Tshibasu

**Description**

Develop API route handlers that support queue ticket CRUD operations.

**Deliverables**

- GET /api/queues
- POST /api/queues
- PATCH /api/queues/:id
- DELETE /api/queues/:id
- Request validation
- Database integration

---

## Success Criteria

This milestone is considered complete when:

- The project runs successfully on all team members' machines.
- MongoDB is connected and core models are functional.
- Users can register, log in, and access protected pages.
- Shared layouts and UI components are available for reuse.
- Queue Ticket CRUD API endpoints are operational.
- All completed work has been reviewed and merged into the main branch through pull requests.

---

## Team Workflow

- Use feature branches for all development.
- Submit all work through pull requests.
- Require at least one peer review before merging.
- Keep issues updated on the GitHub Project Board.
- Move issues through the workflow:
  - Backlog
  - Ready
  - In Progress
  - Review
  - Done

---

## Expected Outcome

At the end of Week 04, Intel-Q will have a solid technical foundation that enables the team to begin implementing customer and staff dashboards, queue management features, and administrative functionality in the following milestone.