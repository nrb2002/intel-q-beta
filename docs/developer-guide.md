# Intel-Q Developer's Guide

## 1. Project Overview

Intel-Q is a cloud-ready, full-stack digital queue-management application built with Next.js, TypeScript, Prisma, and PostgreSQL.

The initial implementation targets a **consular-section environment**, where customers can obtain queue tickets without creating accounts, while staff and administrators authenticate to manage services, queues, windows, and ticket workflows.

The architecture must remain **generic and configurable**. The consular use case is the initial configuration, not a hardcoded limitation of the application.

---

## 2. Core Objectives

Intel-Q must provide:

* Public customer access without account creation.
* First-name collection before issuing a ticket.
* Digital and printable tickets.
* Staff authentication.
* Administrator authentication.
* Configurable services.
* Configurable queue stages.
* Configurable service availability.
* Staff window management.
* Ticket calling.
* Ticket transfers between queue stages.
* Tickets that can move forward or backward in a workflow.
* Customer-facing queue displays.
* Audible ticket announcements.
* Ticket waiting-time tracking.
* Stage-level timing.
* Total processing-time tracking.
* Historical ticket data for analysis.
* Secure role-based API access.
* A clean, responsive, professional interface.

---

# 3. Initial Business Context

The first deployment scenario is a consular section offering:

* Citizen Services
* Immigrant Visas
* Non-immigrant Visas
* Notarials
* Official/Diplomatic Visas

For example, Immigrant Visa Services may contain:

```text
Immigrant Visas
    ├── Intake
    ├── Interview
    ├── Payment
    ├── Delivery
    └── On Hold
```

These values must be configurable.

The application must not contain business logic such as:

```text
if service === "Immigrant Visa"
```

Instead, services and stages should come from the database.

---

# 4. User Types

## 4.1 Customers

Customers do not create accounts and do not authenticate.

A customer:

1. Opens the Customer Welcome Page.
2. Opens the Services Page.
3. Selects a service.
4. Provides at least their first name.
5. Receives a ticket.
6. Prints or downloads the ticket.
7. Waits for the ticket to be called.
8. Follows the ticket through subsequent service stages.

The first name exists primarily to help identify the applicant operationally. Tickets should not expose unnecessary personal information.

Customers may access Intel-Q using:

* Their own phone.
* A friend's phone.
* An installed iPad/touchscreen.
* A computer or kiosk.

The system must therefore never depend on the customer owning a smartphone.

---

## 4.2 Staff

Staff members authenticate through the Staff login route.

Staff can:

* Select a service.
* Select a queue stage.
* Select or use a service window.
* View pending tickets.
* Call the next ticket.
* Recall a ticket.
* Start serving a ticket.
* Put a ticket on hold.
* Resume a ticket.
* Move a ticket to another queue stage.
* Complete a ticket when appropriate.

Staff should only be allowed to perform actions permitted by their role.

---

## 4.3 Administrators

Administrators authenticate through the Admin login route.

Administrators can manage:

* Services.
* Queue stages.
* Service availability.
* Windows.
* Staff accounts/roles where implemented.
* System configuration.
* Historical and analytical information.

Administrative functionality must remain separate from normal staff operations.

---

# 5. Application Architecture

The application follows a Next.js full-stack architecture.

```text
Browser
   │
   ├── Customer Interface
   │
   ├── Staff Interface
   │
   └── Admin Interface
          │
          ▼
     Next.js Application
          │
     ┌────┴────┐
     │         │
   Pages      API Routes
     │         │
     └────┬────┘
          ▼
       Prisma
          │
          ▼
      PostgreSQL
```

The existing Intel-Q project should be reused wherever practical.

Do not rewrite working authentication, Prisma configuration, validation utilities, or reusable UI components without a clear reason.

---

# 6. Technology Stack

The project currently uses:

* Next.js
* React
* TypeScript
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* Zod
* bcrypt
* Existing authentication infrastructure

The exact versions should be determined from the project's `package.json` and should not be unnecessarily upgraded during feature development.

---

# 7. Application Route Structure

The implementation should be organized around three major areas.

## Public Customer Routes

```text
/
```

Customer welcome page.

```text
/services
```

Public service-selection and ticket-issuing page.

```text
/display
```

Public customer queue display.

These routes do not require authentication.

---

## Staff Routes

```text
/login/staff
```

Staff authentication.

```text
/staff
```

Staff dashboard.

Additional staff pages may be added as required.

---

## Admin Routes

```text
/login/admin
```

Administrator authentication.

```text
/admin
```

Administrator dashboard.

Additional administration pages may include:

```text
/admin/services
/admin/queues
/admin/windows
/admin/staff
/admin/reports
```

Routes should only be added when required by the corresponding milestone.

---

# 8. Customer Welcome Page

The Customer Welcome Page is the primary public entry point.

It must clearly communicate how a customer starts the queue process.

The page should provide:

* Organization name.
* Organization logo.
* Short instructions.
* Link to the Services Page.
* QR code linking to the Services Page.
* Clear indication that no account is required.

Example:

```text
Welcome to Intel-Q

To receive a service ticket:

1. Scan the QR code.
2. Select your service.
3. Enter your first name.
4. Print or download your ticket.

[ QR CODE ]

Visit:
intel-q.example/services
```

The interface must work well on:

* Mobile phones.
* Tablets.
* Touchscreen kiosks.
* Desktop displays.

---

# 9. Customer Ticket Process

The customer process is:

```text
Welcome
   ↓
Services
   ↓
Select Service
   ↓
Enter First Name
   ↓
Generate Ticket
   ↓
Print / Download
   ↓
Wait
```

No customer account is required.

## First Name Requirement

A customer must provide at least a first name.

Validation should reject:

* Empty values.
* Whitespace-only values.
* Values exceeding the configured maximum length.

The first name should be validated both client-side and server-side.

---

# 10. Ticket Design

A ticket should contain only the information necessary for queue operation.

Example:

```text
INTEL-Q

Immigrant Visas
Intake

Ticket
IV-042

Applicant
John

Date
15 August 2026
```

The ticket should not expose:

* Passwords.
* Email addresses.
* Internal database IDs.
* Authentication information.
* Unnecessary personal information.

Tickets should support:

* Browser printing.
* Mobile-friendly display.
* Download where appropriate.

---

# 11. Ticket Number Generation

Ticket numbers should be human-readable.

Examples:

```text
IV-042
CS-018
NV-031
NOT-007
DV-012
```

The prefix should be derived from service configuration rather than hardcoded into the application.

Ticket numbers must avoid accidental duplication.

Concurrency must be considered when multiple customers request tickets simultaneously.

---

# 12. Services

A Service represents a customer-facing service offered by the organization.

The initial services are:

```text
Citizen Services
Immigrant Visas
Non-immigrant Visas
Notarials
Official/Diplomatic Visas
```

Services must be database-driven.

A service should support concepts such as:

* Name.
* Description where required.
* Public availability.
* Display ordering.
* Ticket prefix where applicable.
* Active/inactive state.

The customer interface must only display services that are currently available.

---

# 13. Queue Stages

A service may contain multiple queue stages.

Example:

```text
Immigrant Visas

Intake
Interview
Payment
Delivery
On Hold
```

A queue stage represents where the ticket currently needs service.

The system should not create a completely new customer ticket whenever a ticket moves to another stage.

Instead:

```text
Ticket IV-042

Current Stage:
Interview
```

may later become:

```text
Current Stage:
Payment
```

The same ticket remains associated with the customer throughout the workflow.

---

# 14. Ticket Lifecycle

The ticket lifecycle consists of two related concepts:

## General Ticket Status

Examples:

```text
WAITING
CALLED
SERVING
ON_HOLD
COMPLETED
```

## Current Queue Stage

Examples:

```text
Intake
Interview
Payment
Delivery
```

These concepts should not be unnecessarily combined.

For example:

```text
Ticket:
IV-042

Status:
SERVING

Current Stage:
Interview
```

This allows the system to know both:

* what the ticket is currently doing;
* where it is being processed.

---

# 15. Ticket Movement

Tickets must be able to move between stages.

Normal progression:

```text
Intake
  ↓
Interview
  ↓
Payment
  ↓
Delivery
```

However, the system must also support non-linear movement.

For example:

```text
Interview
  ↓
On Hold
  ↓
Interview
```

or:

```text
Interview
  ↓
Intake
```

if additional processing is required.

The application must therefore not assume that ticket stages always move forward.

---

# 16. Staff Window Workflow

Staff members operate service windows.

Example:

```text
Window 03

Service:
Immigrant Visas

Queue:
Interview
```

The staff interface should show:

```text
Currently Serving
IV-041

Next Pending
IV-042

Waiting
IV-043
IV-044
IV-045
```

The staff member can call the next appropriate ticket.

---

# 17. Ticket Calling

When staff call a ticket:

1. The ticket is atomically assigned to the window.
2. The ticket status changes appropriately.
3. The current queue display updates.
4. The customer display shows the ticket.
5. The window number is displayed.
6. An audible announcement is generated.

Example:

```text
IV-042

WINDOW 3
```

Voice announcement:

```text
"Ticket IV-042, please proceed to Window 3."
```

The exact wording may later become configurable.

---

# 18. Concurrent Staff Operations

Multiple staff members may operate simultaneously.

The system must prevent two staff members from successfully claiming the same pending ticket.

Ticket claiming should therefore be treated as an atomic database operation wherever possible.

Avoid implementations where the client:

```text
GET next ticket
```

and later:

```text
UPDATE ticket
```

without protecting the interval between the two operations.

The backend must remain the authority for ticket assignment.

---

# 19. Customer Display

The Customer Display is a public endpoint.

Example:

```text
NOW SERVING

IV-042
WINDOW 3
```

It may also display multiple active calls:

```text
NOW SERVING

IV-042    Window 3
CS-018    Window 1
N-007     Window 4
```

The display should show enough information for customers to identify where they need to go.

It should not display sensitive customer information.

Only ticket identifiers, service information, and window information should normally be displayed.

---

# 20. Voice Announcements

The customer display should provide audible announcements when supported by the browser.

Example:

```text
Ticket IV-042,
please proceed to Window 3.
```

The implementation may use browser-supported speech synthesis.

The application must gracefully handle browsers or environments where speech synthesis is unavailable.

Visual display must remain fully functional even when audio is unavailable.

---

# 21. Ticket Timing

Timing is a major part of Intel-Q's analytical value.

The system should record timestamps for meaningful ticket events.

Examples include:

```text
createdAt
calledAt
serviceStartedAt
stageStartedAt
stageCompletedAt
completedAt
```

Actual field names should follow the final Prisma schema.

The system should be capable of determining:

### Waiting Time

Time between entering a queue stage and being called/served.

### Stage Processing Time

Time spent being processed at a particular stage.

### Total Processing Time

Time between initial ticket creation and final completion.

---

# 22. Historical Data

When a ticket is completed, it should disappear from the active operational queue.

However, it should generally **not be physically deleted from the database**.

"Destroy the ticket" in operational terms means:

```text
Active Queue
      ↓
Completed
      ↓
Removed from active operational views
      ↓
Historical data retained
```

This is essential for reporting and analysis.

---

# 23. Analytics

Historical data should eventually support:

* Total tickets.
* Completed tickets.
* Tickets currently waiting.
* Tickets on hold.
* Average waiting time.
* Average service time.
* Average total processing time.
* Average stage duration.
* Tickets per service.
* Tickets per queue stage.
* Tickets per window.
* Daily volume.
* Peak periods.

Analytics should be based on persisted ticket history rather than temporary frontend state.

---

# 24. API Design

Public APIs should be intentionally limited.

Potential public endpoints include:

```text
GET  /api/services
POST /api/tickets
GET  /api/display
```

Staff endpoints may include:

```text
GET   /api/staff/queues
POST  /api/tickets/:id/call
POST  /api/tickets/:id/transition
POST  /api/tickets/:id/hold
POST  /api/tickets/:id/resume
POST  /api/tickets/:id/complete
```

Administrative endpoints may include:

```text
GET    /api/admin/services
POST   /api/admin/services
PATCH  /api/admin/services/:id
DELETE /api/admin/services/:id
```

Actual endpoints should follow the existing project's conventions.

---

# 25. Validation

Zod should be used for important request validation.

Validation must happen:

1. On the client for user experience.
2. On the server for security and data integrity.

Client validation must never be considered sufficient protection.

The existing validation pattern, such as:

```text
lib/validations/
```

should be maintained.

Possible schemas include:

```text
register.ts
branch.ts
service.ts
ticket.ts
queue.ts
staff.ts
```

Only create schemas when the corresponding functionality requires them.

---

# 26. Authentication and Authorization

The existing authentication infrastructure should be reused.

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do?

For example:

```text
CUSTOMER
    No authenticated account required.

STAFF
    Queue operations.

ADMIN
    System configuration.
```

Every protected API endpoint must verify authorization server-side.

Do not rely solely on hiding buttons in the frontend.

---

# 27. Database Principles

PostgreSQL remains the primary database.

Prisma remains the ORM.

The existing data model should be preserved where possible.

The project should avoid unnecessary database restructuring during the 10-day implementation.

When a new feature can be implemented using the existing structure, prefer that approach.

If a schema modification becomes necessary, it must be:

1. Reflected in `schema.prisma`.
2. Migrated properly.
3. Tested against existing functionality.
4. Regenerated through Prisma.
5. Documented.

---

# 28. Existing Branch Functionality

The previous Intel-Q implementation contains branch functionality, including:

```text
BranchCard
BranchForm
BranchList
CreateBranchForm
```

and API routes such as:

```text
/api/branches
/api/branches/[id]
```

The existing implementation should not be discarded automatically.

Branches can remain part of the application's organization/service-location model.

However, branch functionality must not prevent the new service/queue workflow from being developed.

Where appropriate:

```text
Branch
   ↓
Services
   ↓
Queues
   ↓
Windows
   ↓
Tickets
```

The exact relationship should follow the existing Prisma model unless a schema change is explicitly required.

---

# 29. Frontend Architecture

Reusable components should be placed under:

```text
components/
```

A possible organization is:

```text
components/
├── auth/
├── branch/
├── customer/
├── ticket/
├── queue/
├── staff/
├── admin/
└── display/
```

Components should have clear responsibilities.

Avoid putting database or authorization logic inside presentational components.

---

# 30. Client State Management

Use React state for local UI state where appropriate.

Avoid unnecessary global state.

Server/API data should remain authoritative.

For example, after a staff member calls a ticket, the UI should update based on the server's confirmed result rather than assuming the operation succeeded.

This is especially important for queue operations involving multiple staff members.

---

# 31. Error Handling

API routes should return meaningful HTTP statuses.

Examples:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Error messages returned to customers should be understandable without exposing internal implementation details.

Do not expose:

* Prisma errors.
* Stack traces.
* Database information.
* Authentication internals.
* Sensitive server information.

Server logs may contain diagnostic information where appropriate.

---

# 32. Loading and Empty States

Every major asynchronous interface should handle:

* Loading.
* Success.
* Empty.
* Error.

For example, a queue page should not remain blank while data loads.

Use consistent patterns throughout the application.

---

# 33. Accessibility

The application should be usable by as many customers as possible.

Forms should provide:

* Proper labels.
* Keyboard navigation.
* Visible focus states.
* Accessible error messages.
* `aria-invalid` where appropriate.
* `aria-describedby` for validation messages.

The public display should use large, high-contrast ticket numbers that can be read from a distance.

---

# 34. Responsive Design

The application must support:

### Customer

```text
Mobile
Tablet
Kiosk
Desktop
```

### Staff

```text
Tablet
Laptop
Desktop
```

### Display

```text
TV
Monitor
Tablet
Desktop
```

Avoid layouts that depend on a specific screen size.

---

# 35. QR Code

The Customer Welcome Page should provide a QR code pointing to the public Services Page.

The QR code must:

* Be large enough to scan.
* Have adequate contrast.
* Have a human-readable URL beneath it.
* Point to the correct production URL after deployment.

The QR destination must not require authentication.

---

# 36. Security Considerations for Public Ticket Issuing

Because customers do not authenticate, the ticket endpoint is publicly accessible.

The system should consider:

* Request validation.
* Rate limiting.
* Duplicate submission protection.
* Reasonable request limits.
* Service availability checks.
* Server-generated ticket numbers.
* Server-side timestamps.
* Prevention of unauthorized ticket manipulation.

Do not trust ticket IDs, statuses, service IDs, or timestamps supplied by the customer.

The backend should determine these values.

---

# 37. Configuration Philosophy

The consular deployment is an initial configuration.

Avoid hardcoding:

```text
Citizen Services
Immigrant Visas
Window 1
Window 2
```

into application logic.

Instead, these should eventually come from configuration/database data.

This allows Intel-Q to support another organization without rewriting the core queue engine.

---

# 38. Development Milestones

Development is divided into ten milestones.

```text
01 - Project Foundation & Refactoring
02 - Authentication & Authorization
03 - Services & Queue Configuration
04 - Customer Ticket Issuing
05 - Staff Window & Queue Management
06 - Ticket State Machine & Workflow
07 - Customer Display & Voice Calling
08 - Ticket Completion & Analytics
09 - UI, Security & Hardening
10 - Testing, Deployment & Documentation
```

Each milestone is represented by a separate Markdown issue file.

---

# 39. Ten-Day Implementation Strategy

## Day 1

Foundation and refactoring.

Verify:

* Project builds.
* Database works.
* Authentication works.
* Existing components remain functional.

## Day 2

Staff/Admin authentication and authorization.

## Day 3

Services and queue-stage configuration.

## Day 4

Customer service page and ticket issuing.

## Day 5

Staff dashboard and window operations.

## Day 6

Ticket transitions and timing.

## Day 7

Customer display and voice announcements.

## Day 8

Completion and historical/analytical data.

## Day 9

UI polish, security, validation, and edge cases.

## Day 10

Full testing, production deployment, documentation, and final demonstration preparation.

---

# 40. MVP Priority

If development time becomes constrained, prioritize the following:

### Critical

1. Customer ticket issuing.
2. Staff authentication.
3. Service/queue selection.
4. Ticket calling.
5. Ticket transitions.
6. Customer display.
7. Window identification.
8. Ticket completion.
9. Database persistence.

### Important

10. Voice announcements.
11. Ticket printing.
12. Ticket download.
13. Timing calculations.
14. Admin service configuration.

### Secondary

15. Advanced analytics.
16. Advanced reporting.
17. Advanced configuration.
18. UI refinements beyond the core professional experience.

The application must have a working end-to-end queue workflow before advanced features are prioritized.

---

# 41. End-to-End Workflow

The complete expected workflow is:

```text
ADMIN
  │
  ├── Login
  │
  ├── Configure Services
  │
  ├── Configure Queue Stages
  │
  └── Enable Services
           │
           ▼
CUSTOMER
  │
  ├── Open Welcome Page
  │
  ├── Scan QR Code / Open Services
  │
  ├── Select Service
  │
  ├── Enter First Name
  │
  └── Print / Download Ticket
           │
           ▼
STAFF
  │
  ├── Login
  │
  ├── Select Window
  │
  ├── Select Service
  │
  ├── Select Queue Stage
  │
  └── Call Ticket
           │
           ▼
CUSTOMER DISPLAY
  │
  ├── Show Ticket Number
  ├── Show Window
  └── Announce Ticket
           │
           ▼
STAFF
  │
  ├── Serve Customer
  │
  ├── Complete Current Stage
  │
  └── Move Ticket
           │
           ▼
NEXT QUEUE
  │
  ├── Ticket becomes pending
  ├── Next staff member calls ticket
  └── Customer display updates
           │
           ▼
FINAL WINDOW
  │
  └── Complete Ticket
           │
           ▼
HISTORICAL DATA
  │
  ├── Waiting Times
  ├── Stage Times
  ├── Service Times
  └── Total Processing Time
```

---

# 42. Definition of Done

A milestone is considered complete only when:

* The feature works in the UI.
* Its API behavior is implemented.
* Server-side validation exists where necessary.
* Authentication/authorization is enforced where required.
* Errors are handled.
* Loading states are handled.
* The feature works against PostgreSQL/Prisma.
* TypeScript builds without errors.
* Existing functionality has not been unnecessarily broken.
* The relevant issue documentation is updated.

---

# 43. Final Product Definition

At the end of the ten-day implementation, Intel-Q should provide a complete operational queue-management MVP.

A customer should be able to walk into a consular section and:

```text
Scan QR
   ↓
Select Service
   ↓
Enter First Name
   ↓
Receive Ticket
   ↓
Wait
   ↓
See Ticket Called
   ↓
Hear Announcement
   ↓
Go to Window
   ↓
Continue Through Required Stages
   ↓
Complete Service
```

Staff should be able to:

```text
Login
   ↓
Select Window
   ↓
Select Queue
   ↓
Call Customer
   ↓
Serve Customer
   ↓
Move Ticket
   ↓
Complete Ticket
```

Administrators should be able to:

```text
Login
   ↓
Configure Services
   ↓
Configure Queues
   ↓
Enable/Disable Services
   ↓
Manage Operational Configuration
```

The system should retain the operational history required to answer questions such as:

* How many customers were served today?
* Which service is busiest?
* How long do customers wait before being served?
* Which queue stage takes the longest?
* Which windows process the most tickets?
* How long does the complete customer journey take?

The resulting system should remain simple for customers and staff while providing a strong technical foundation for future Intel-Q functionality.

---

# 44. Guiding Principle

> **Keep the customer experience simple, keep staff operations fast, keep administration configurable, and keep the queue engine generic.**

The consular section is the first real-world use case. Intel-Q itself should remain a reusable queue-management platform.
