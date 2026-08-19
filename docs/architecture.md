Intel-Q Application Architecture

Project: Intel-Q – Intelligent Queue Management System
Architecture Version: 2.0
Framework: Next.js (App Router)
Language: TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: Auth.js v5
Validation: Zod
Styling: Tailwind CSS + shadcn/ui
Hosting: Vercel

1. Overview

Intel-Q is a full-stack digital queue-management system designed for organizations that provide services to customers through one or more service windows.

The current implementation is being adapted from the original Intel-Q application template into a service-oriented queue-management workflow.

The primary workflow is designed around environments such as:

Consular sections
Government service centers
Banks
Hospitals and clinics
Pharmacies
Universities
Customer-service centers
Other organizations operating physical service queues

For the current project, the primary use case is a consular section where customers may receive services such as:

Citizen Services
Immigrant Visas
Non-immigrant Visas
Notarials
Official/Diplomatic Visas

Customers do not create accounts to obtain queue tickets.

Instead, the public customer interface allows a customer to:

Access the Services page.
Provide at least a first name.
Select an available service.
Receive a queue ticket.
Print or download the ticket.
Follow the ticket through the service process.

Staff members manage tickets from service/window interfaces, while administrators manage the system and its configuration.

The architecture follows a server-first Next.js App Router design, with PostgreSQL as the persistent data store and Prisma as the database access layer.

2. Current Architecture Principles

The application is built around the following principles.

2.1 Customer access without authentication

Customers must not be required to create accounts or sign in merely to obtain a ticket.

The public workflow is intentionally lightweight because customers may:

Not own a smartphone.
Use another person's phone.
Use a public tablet/iPad.
Be in an environment where phones are not permitted.
Need to obtain a ticket quickly.

The customer must provide a first name before a ticket can be created.

The first name is used as a lightweight identity/reference mechanism without requiring a customer account.

2.2 Staff and administrators are authenticated

The system has separate authenticated experiences for:

Staff
Administrators

Staff authentication protects operational functionality such as:

Viewing pending tickets.
Calling tickets.
Assigning tickets to windows.
Changing ticket status.
Moving tickets between queues/statuses.
Completing service.

Administrators have additional management capabilities.

2.3 Services are the entry point to the queue

Customers do not select a generic queue number.

They select a service.

For example:

Immigrant Visa
Non-Immigrant Visa
Citizen Services
Notarials
Official/Diplomatic Visa

A service may contain multiple operational stages.

For example:

Immigrant Visa


        │
        ▼
     Intake
        │
        ├──────────────► On Hold
        │
        ▼
    Interview
        │
        ▼
     Payment
        │
        ▼
    Delivery
        │
        ▼
    Completed

These stages are represented by the ticket's status/queue state rather than requiring a separate physical ticket for every stage.

2.4 Ticket status can move in multiple directions

A ticket is not necessarily processed linearly.

For example:

INTAKE
   │
   ├──► INTERVIEW
   │
   └──► ON_HOLD
           │
           ▼
        INTAKE

A ticket may therefore move backward or forward depending on the operational requirements.

This is particularly important for consular workflows where an applicant may need to:

Provide additional documentation.
Return to a previous window.
Wait for another process.
Be placed on hold.
Continue to another service stage.
2.5 Ticket lifecycle

A ticket generally follows:

Created
   │
   ▼
Pending
   │
   ▼
Called
   │
   ▼
Being Served
   │
   ├──────────────► On Hold
   │                   │
   │                   ▼
   │                Pending
   │
   ▼
Next Status
   │
   ▼
Completed
   │
   ▼
Destroyed

Once the final staff member completes the applicant's service, the ticket is destroyed/removed according to the application's business rules.

3. High-Level Architecture

Intel-Q follows a layered full-stack architecture.

┌──────────────────────────────────────────────────────────────┐
│                         USER DEVICES                         │
│                                                              │
│ Customer                Staff                 Administrator  │
│ ────────                ─────                 ─────────────  │
│ Phone                   Desktop               Desktop        │
│ Public iPad             Tablet                Laptop         │
│ Waiting-area screen                           Admin device  │
└───────────────────────────────┬──────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP                          │
│                         App Router                           │
│                                                              │
│ ┌───────────────────┐     ┌───────────────────────────────┐  │
│ │ Server Components │     │       Client Components       │  │
│ │                   │     │                               │  │
│ │ Public Pages      │     │ Ticket Forms                  │  │
│ │ Protected Pages   │     │ Queue Controls                │  │
│ │ Layouts           │     │ Staff Actions                 │  │
│ │ Data Fetching     │     │ Ticket Printing               │  │
│ │ Authenticated UI  │     │ Live Display                  │  │
│ └─────────┬─────────┘     └──────────────┬────────────────┘  │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          ▼                                   │
│                ┌─────────────────────┐                      │
│                │ Route Handlers      │                      │
│                │ Server Actions      │                      │
│                │ Authentication      │                      │
│                └──────────┬──────────┘                      │
│                           │                                  │
│                           ▼                                  │
│                ┌─────────────────────┐                      │
│                │ Application Logic   │                      │
│                │ Queue Operations     │                      │
│                │ Ticket Lifecycle     │                      │
│                │ Authorization       │                      │
│                └──────────┬──────────┘                      │
│                           │                                  │
│                           ▼                                  │
│                ┌─────────────────────┐                      │
│                │      Prisma ORM     │                      │
│                └──────────┬──────────┘                      │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ PostgreSQL Connection
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │      Database       │
                 └─────────────────────┘
4. Application Actors
4.1 Customer

The customer is an unauthenticated public user.

The customer can:

Access the public Services page.
View currently available services.
Provide a first name.
Select a service.
Generate a ticket.
Print the ticket.
Download the ticket when using a personal device.
View public queue information.

The customer cannot:

Access staff functionality.
Access administrative functionality.
Modify existing tickets.
View protected customer information.
5. Staff

Staff users authenticate through the staff login route.

Staff functionality includes:

Viewing available services.
Viewing pending tickets.
Calling the next ticket.
Selecting/working from a service queue.
Associating a ticket with a service window.
Changing ticket status.
Moving tickets between stages.
Placing tickets on hold.
Returning tickets to previous stages when necessary.
Completing the service.
Destroying/completing tickets at the final stage.

Staff should not be required to know the customer's personal identity beyond the information necessary to process the ticket.

6. Administrator

Administrators authenticate through the administrator login route.

Administrative functionality includes management of:

Branches/service locations.
Services.
Service stages/queues.
Windows.
Staff accounts.
Operational configuration.

Administrative permissions should be enforced server-side and must not rely solely on hiding UI elements.

7. Public Customer Architecture

The public customer workflow is deliberately separate from authentication.

Customer Welcome Page
        │
        │ QR Code / Link
        ▼
Services Page
        │
        ▼
Select Service
        │
        ▼
Enter First Name
        │
        ▼
Create Ticket
        │
        ├──────────────► Print
        │
        └──────────────► Download

The Customer Welcome Page should clearly display:

A link to the Services page.
A QR code pointing to the Services page.
Instructions for customers.

This is particularly important in consular environments where customers may be directed to a public iPad or waiting-area device.

8. Staff Queue Architecture

Staff interact with tickets through service/window management interfaces.

The operational flow is:

Staff Login
    │
    ▼
Service / Queue Management
    │
    ▼
Select Available Queue
    │
    ▼
View Pending Tickets
    │
    ▼
Call Ticket
    │
    ▼
Window Assigned
    │
    ▼
Serve Customer
    │
    ▼
Change Ticket Status
    │
    ├──────► Next Queue
    │
    ├──────► On Hold
    │
    └──────► Completed

A staff member does not necessarily belong permanently to one service or window.

The system should support the operational requirement that an authorized staff member can access the relevant queue/service management interface and process available tickets.

9. Customer Display Architecture

A dedicated public display endpoint presents queue activity.

The display may show:

NOW SERVING


        A104
        Window 3


Next


        A105
        A106
        A107

The display can also show:

Currently available services.
Tickets being called.
Window numbers.
Next pending tickets.
Service names.
Operational announcements where appropriate.

When a ticket is called, the system should trigger an audible announcement.

Example:

"Ticket A104, please proceed to Window 3."

The browser's Web Speech API or another appropriate browser-compatible speech mechanism may be used for the MVP.

10. Queue and Ticket Model

The ticket is the central operational object.

A ticket represents a customer's position within a service workflow.

Conceptually:

Ticket
 │
 ├── Ticket Number
 ├── First Name
 ├── Service
 ├── Current Status
 ├── Current Window
 ├── Created Time
 ├── Called Time
 ├── Completed Time
 └── Status History

The system must maintain sufficient timestamps to calculate waiting and service durations.

11. Status-Based Queue Architecture

Multiple queues within a service are represented by ticket statuses/stages.

For example:

Service:
Immigrant Visa


Statuses:


INTAKE
INTERVIEW
PAYMENT
DELIVERY
ON_HOLD
COMPLETED

A ticket can therefore move between statuses:

A104
  │
  ▼
INTAKE
  │
  ▼
INTERVIEW
  │
  ▼
PAYMENT
  │
  ▼
DELIVERY
  │
  ▼
COMPLETED

Or:

INTERVIEW
    │
    ▼
 ON_HOLD
    │
    ▼
INTERVIEW

The application must not assume that status transitions are always strictly forward-moving.

12. Ticket Timing and Analytics

The application must record the time a ticket enters and leaves each stage.

For example:

Ticket A104


Created:
08:15


Intake:
08:15 → 08:32
Waiting: 17 min


Interview:
09:05 → 09:24
Waiting before interview: 33 min


Payment:
09:40 → 09:48
Waiting before payment: 16 min


Delivery:
10:15 → 10:20
Waiting before delivery: 27 min

At completion, the system can calculate:

Total customer journey time
Total waiting time
Total service time
Time per stage
Number of stages visited
Number of times placed on hold

This information will form the basis for future reporting and operational analytics.

13. Ticket Calling

Calling a ticket is an operational state transition.

Conceptually:

Pending Ticket
      │
      ▼
Call Ticket
      │
      ├── Record calledAt
      ├── Associate window
      ├── Update ticket state
      └── Publish/display call

The customer display consumes the resulting state and presents:

Ticket: A104
Window: 3

An audible announcement accompanies the visual update.

14. Ticket Completion and Destruction

The final service window may complete the customer's workflow.

When the ticket is finished:

Final Service
      │
      ▼
Complete Ticket
      │
      ▼
Record final timestamps
      │
      ▼
Persist analytics information
      │
      ▼
Remove from active queue

The application should distinguish between removing a ticket from active operational queues and destroying historical analytical data.

Where possible, historical records should be retained in a suitable form for reporting while the ticket is removed from active queues.

15. Database Architecture

PostgreSQL remains the primary database.

Prisma provides type-safe database access.

The existing database structure is preserved as the foundation for the project rather than unnecessarily replacing the working schema.

Conceptually, the application contains the following areas:

User
 │
 └── Authentication / Authorization


Branch
 │
 └── Service Location


Service
 │
 └── Available Customer Service


Queue Ticket
 │
 ├── Customer Reference
 ├── Service
 ├── Current Status
 ├── Window
 └── Timing Information

Additional relational structures may be introduced only where required by the milestones and existing data-model constraints.

16. Authentication Architecture

Auth.js v5 provides authentication for protected users.

The architecture separates public and protected routes.

PUBLIC
│
├── Welcome
├── Services
├── Ticket Creation
└── Customer Display


PROTECTED
│
├── Staff Login
├── Staff Queue Management
├── Admin Login
└── Administration

Authentication and authorization must be enforced on the server.

The UI may hide unauthorized actions, but server-side authorization is the authoritative security boundary.

17. Route Architecture

The application uses the Next.js App Router.

A conceptual structure is:

app/
│
├── page.tsx
│
├── services/
│   └── page.tsx
│
├── display/
│   └── page.tsx
│
├── staff/
│   ├── login/
│   │   └── page.tsx
│   │
│   └── queues/
│       └── page.tsx
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   │
│   └── ...
│
└── api/
    ├── auth/
    ├── branches/
    ├── services/
    ├── tickets/
    ├── queues/
    └── display/

The exact route structure may evolve during implementation, but public, staff, and administrative responsibilities should remain clearly separated.

18. Component Architecture

Reusable components are organized by domain.

Conceptually:

components/
│
├── branch/
│   ├── BranchCard.tsx
│   ├── BranchForm.tsx
│   ├── BranchList.tsx
│   └── CreateBranchForm.tsx
│
├── customer/
│   ├── ServiceCard.tsx
│   ├── TicketForm.tsx
│   └── TicketDisplay.tsx
│
├── staff/
│   ├── QueuePanel.tsx
│   ├── TicketRow.tsx
│   ├── CallTicketButton.tsx
│   └── StatusSelector.tsx
│
├── admin/
│   └── ...
│
├── display/
│   ├── NowServing.tsx
│   └── NextTickets.tsx
│
└── ui/
    └── reusable UI components

Existing working branch components should be reused wherever possible.

19. Validation Architecture

Zod is used for input validation.

Validation should occur at both:

Client side

Used to provide immediate feedback.

Server side

Used as the authoritative validation boundary.

For example:

Customer Input
      │
      ▼
Client Validation
      │
      ▼
API Request
      │
      ▼
Server Validation
      │
      ▼
Business Logic
      │
      ▼
Prisma

Validation schemas should be located under:

lib/validations/

Examples:

register.ts
branch.ts
service.ts
ticket.ts
queue.ts
20. API Architecture

API route handlers are responsible for HTTP-level concerns.

They should:

Authenticate the request where required.
Authorize the user.
Validate request data.
Execute application logic.
Interact with Prisma.
Return consistent responses.

Example:

POST /api/tickets


Request
   │
   ▼
Validate firstName + service
   │
   ▼
Determine active service queue
   │
   ▼
Generate ticket number
   │
   ▼
Create ticket
   │
   ▼
Return ticket

API errors should follow a consistent structure.

For example:

{
  "error": "Unable to create ticket."
}

Validation errors may include:

{
  "error": "Please correct the highlighted fields.",
  "fieldErrors": {
    "firstName": [
      "First name is required."
    ]
  }
}
21. Business Logic

Queue-related business rules should not be scattered throughout React components.

Important operations should be centralized where practical.

Examples include:

Ticket number generation.
Finding the next pending ticket.
Calling a ticket.
Assigning a window.
Changing ticket status.
Moving a ticket to another queue.
Placing a ticket on hold.
Completing a ticket.
Recording status timing.
Determining whether a ticket can be deleted/destroyed.

The architecture should favor reusable server-side functions/services over duplicating logic across API handlers.

22. Error Handling

The application uses predictable HTTP status codes.

Examples:

200  Successful request
201  Resource created
400  Invalid request
401  Authentication required
403  Insufficient permissions
404  Resource not found
409  Business conflict
500  Server error

User-facing messages should be understandable without exposing internal database or server information.

Server logs may contain additional diagnostic information.

23. Security Architecture

Security responsibilities include:

Authentication

Handled by Auth.js.

Authorization

Role-based authorization is enforced server-side.

Password security

Passwords are hashed using bcrypt before persistence.

Input validation

Zod validates external input.

Database security

Database access occurs through Prisma on the server.

Client components must never directly access PostgreSQL.

Sensitive information

Customer information should be minimized.

The queue system should use ticket codes/numbers rather than unnecessarily exposing customer information on public displays.

24. Public Display Privacy

The public display must not expose sensitive customer information.

The display should primarily show:

Ticket Number
Window Number
Service

The customer's first name should not normally be displayed publicly unless there is a clearly justified operational requirement.

This is particularly important in consular and government-service environments.

25. Existing Template Reuse

The current Intel-Q project originated as a more traditional authenticated queue application.

The new architecture intentionally preserves working infrastructure where it remains useful.

Existing reusable functionality includes:

PostgreSQL configuration.
Prisma configuration.
Auth.js configuration.
User model.
Role system.
Branch model.
Branch APIs.
Branch components.
Zod validation patterns.
Shared UI patterns.
Existing deployment configuration.

Obsolete assumptions should be isolated rather than causing unnecessary rewrites.

In particular, the customer ticket workflow must no longer depend on customer authentication.

26. Development Structure

The project should maintain a clear separation between:

app/
    Routes and pages


components/
    Reusable UI


lib/
    Shared application infrastructure


lib/validations/
    Zod schemas


lib/auth/
    Authentication


lib/db/
    Prisma/database access


prisma/
    Database schema and migrations

As queue functionality grows, additional service-layer modules may be introduced.

27. Deployment Architecture

The production architecture is:

Customer / Staff / Admin
          │
          ▼
       Internet
          │
          ▼
      Vercel
          │
          ▼
     Next.js App
          │
          ▼
       Prisma
          │
          ▼
    PostgreSQL

Environment variables must be configured in the deployment environment rather than committed to source control.

Typical variables include:

DATABASE_URL
AUTH_SECRET
AUTH_URL

The exact variables depend on the existing Auth.js and deployment configuration.

28. Development Environment

Developers should be able to run the application locally using:

npm install
npm run dev

Database changes should be managed through Prisma migrations.

Typical commands include:

npx prisma generate
npx prisma migrate dev

Before committing significant changes:

npm run lint
npm run build

TypeScript errors should be resolved rather than ignored.

29. Testing Strategy

The MVP should prioritize testing of critical queue operations.

Authentication
Staff can sign in.
Administrators can sign in.
Unauthorized users cannot access protected operations.
Ticket creation
Customer can access Services without authentication.
First name is required.
Service selection is required.
Ticket is generated successfully.
Ticket can be printed/downloaded.
Queue operations
Staff can view pending tickets.
Staff can call a ticket.
Window assignment works.
Status transitions work.
Tickets can move backward or forward.
On-hold workflow works.
Final completion works.
Customer display
Called tickets appear.
Window numbers appear.
Next pending ticket is displayed.
Audible announcement is triggered where supported.
30. Architecture Constraints for the MVP

To keep the two-week implementation achievable, the project should avoid unnecessary complexity.

The MVP should not introduce:

Customer account registration.
Customer password management.
Customer profiles.
Mobile applications.
Complex real-time infrastructure unless required.
Microservices.
Separate database servers for different domains.
Unnecessary third-party queue providers.

The architecture should remain a single Next.js application backed by PostgreSQL.

31. Future Architecture Direction

The architecture should leave room for future functionality without implementing it prematurely.

Potential future features include:

Multi-organization support.
Multi-branch organizations.
Dynamic service configuration.
Dynamic service stages.
Configurable windows.
Custom ticket numbering.
SMS notifications.
Email notifications.
QR-code ticket lookup.
Advanced analytics.
Staff performance metrics.
Average waiting-time dashboards.
Service-level monitoring.
Audit logs.
Real-time WebSocket/SSE updates.
Multi-language customer interfaces.
Accessibility enhancements.

These features should not compromise the simplicity of the MVP architecture.

32. Architectural Decision Summary
Area	Decision
Framework	Next.js App Router
Language	TypeScript
Database	PostgreSQL
ORM	Prisma
Authentication	Auth.js v5
Validation	Zod
Styling	Tailwind CSS + shadcn/ui
Hosting	Vercel
Customer Authentication	Not required for ticket creation
Staff Authentication	Required
Admin Authentication	Required
Customer Identity	First name + ticket number
Queue Representation	Ticket status/stage
Ticket Movement	Forward and backward
Queue Timing	Timestamp/status history
Public Display	Dedicated display endpoint
Ticket Calling	Staff-controlled
Voice Announcement	Browser speech capability
Branch Management	Existing functionality retained
Database Strategy	Preserve existing schema/data model
Architecture Style	Monolithic full-stack Next.js
MVP Priority	Reliable queue workflow over unnecessary complexity
33. Core Architectural Workflow

The complete system can be summarized as:

                    ┌──────────────────┐
                    │  Welcome Page    │
                    │ QR Code + Link   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Services Page    │
                    │ Public / No Login│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Enter First Name │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Select Service   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Create Ticket    │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          Print / Download         Queue Database
                                         │
                                         ▼
                               ┌──────────────────┐
                               │ Staff Queue Page │
                               └────────┬─────────┘
                                        │
                                        ▼
                                Call Next Ticket
                                        │
                                        ▼
                               Assign Window
                                        │
                                        ▼
                                Serve Customer
                                        │
                                        ▼
                               Change Status
                                  │       │
                     ┌────────────┘       └────────────┐
                     ▼                                 ▼
                  On Hold                         Next Stage
                     │                                 │
                     └──────────────┬──────────────────┘
                                    ▼
                              Final Service
                                    │
                                    ▼
                              Complete Ticket
                                    │
                                    ▼
                         Remove From Active Queue
                                    │
                                    ▼
                             Analytics Data




       ┌─────────────────────────────────────────────┐
       │          CUSTOMER DISPLAY ENDPOINT          │
       │                                             │
       │   NOW SERVING: A104                         │
       │   WINDOW: 3                                 │
       │                                             │
       │   NEXT: A105, A106, A107                   │
       │                                             │
       │   + Audible Announcement                   │
       └─────────────────────────────────────────────┘