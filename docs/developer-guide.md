# Intel-Q Developer's Guide

## Consular Queue Management MVP

### 1. Project Overview

Intel-Q is a cloud-based queue management application designed to digitize customer flow for organizations that operate multiple service queues and service windows.

For the current MVP, Intel-Q is adapted to the operational reality of a **consular section**.

The system allows customers to obtain queue tickets without creating accounts while allowing authorized staff to manage queues, call tickets, move tickets between service stages, and complete tickets.

The application must remain simple, professional, reliable, and suitable for deployment in a real operational environment.

---

# 2. Current Consular Use Case

The consular section provides services such as:

* Citizen Services
* Immigrant Visas
* Non-immigrant Visas
* Notarials
* Official/Diplomatic Visas

A service may contain multiple operational queues or stages.

For example:

**Immigrant Visa Services**

* Intake
* Interview
* Payment
* Delivery
* On Hold

These stages are represented through the ticket's status.

A ticket may move between statuses in either direction when operational circumstances require it.

Example:

```text
INTAKE
   ↓
INTERVIEW
   ↓
PAYMENT
   ↓
DELIVERY
```

But a ticket may also move backward or be placed on hold:

```text
INTAKE
   ↓
INTERVIEW
   ↓
ON_HOLD
   ↓
INTERVIEW
```

The system must therefore not assume that queue progression is always linear.

---

# 3. Core Design Principles

Intel-Q should follow these principles:

### Simple

Customers should be able to obtain a ticket with minimal interaction.

### No customer accounts

Customers must **not** be required to register or log in to obtain a ticket.

### Lightweight identification

Before receiving a ticket, the customer must provide at least their **first name**.

The first name is associated with the queue ticket and printed on the ticket.

It is not a customer account and must not be treated as strong authentication.

### Operational privacy

Customer names must not be displayed publicly on the customer-facing queue display.

The public display should primarily show:

* Ticket number
* Service
* Window
* Queue/status information where appropriate

### Server-generated tickets

Customers must never choose or submit their own ticket number.

The server generates the ticket number.

### Flexible workflow

Tickets can move between statuses in either direction.

### Auditable timing

The system records how long a ticket spends in each status and the total processing time.

### Staff-driven operations

Staff members control queue progression from the staff interface.

---

# 4. User Roles

The MVP has three conceptual roles.

## Customer

Customers do not authenticate.

They can:

* Access the public Services page
* View currently available services
* Select a service
* Enter their first name
* Generate a ticket
* Print a ticket
* Download a ticket when using a personal device

Customers cannot:

* Modify tickets
* Change ticket status
* Call tickets
* Access staff functionality
* Access administrative functionality

---

## Staff

Staff members authenticate through the staff login route.

Staff can:

* View available services
* View pending tickets
* View tickets assigned to their current queue/window
* Call the next ticket
* Recall a ticket where appropriate
* Move tickets to another status
* Place tickets on hold
* Return tickets from hold
* Complete/destroy tickets after final service
* View relevant ticket information

Staff should not be responsible for changing global application configuration.

---

## Administrator

Administrators authenticate through the administrator login route.

Administrators can manage system configuration and operational settings.

Depending on the final MVP scope, this may include:

* Services
* Queue/status configuration
* Windows
* Staff accounts
* Branch/location information
* Organization settings
* Application configuration
* Operational reports

---

# 5. Authentication Routes

The application must provide separate authentication entry points for staff and administrators.

Conceptually:

```text
/staff/login
/admin/login
```

Customers do not have an authentication route.

The public customer interface must remain accessible without authentication.

Authorization must be enforced server-side.

Hiding UI elements is not sufficient security.

---

# 6. Customer Journey

The customer journey is intentionally short.

```text
Customer Welcome Page
        ↓
Services Page
        ↓
Select Service
        ↓
Enter First Name
        ↓
Generate Ticket
        ↓
Print / Download Ticket
        ↓
Wait for Call
```

---

# 7. Customer Welcome Page

The welcome page is the primary entry point for customers.

It should clearly provide access to the Services page.

The page should include:

* Organization/consular branding
* Clear instructions
* Services access button/link
* QR code leading to the Services page

The QR code is particularly useful for customers who can use a smartphone.

Customers who cannot use a smartphone can use the touch-screen device provided in the waiting area.

---

# 8. Services Page

The Services page is public.

No authentication is required.

It displays services that are currently available.

For example:

```text
Welcome

Please select the service you require.

[ Citizen Services ]

[ Immigrant Visas ]

[ Non-immigrant Visas ]

[ Notarials ]

[ Official / Diplomatic Visas ]
```

Services that have not been opened by staff must not be available for ticket creation.

---

# 9. Opening Services

Every morning, authorized staff or administrators can open the required services.

Conceptually:

```text
Service
       ↓
OPEN
       ↓
Visible to customers
```

A closed service should not appear as an available ticket option.

This allows the system to adapt to daily operational conditions.

For example, if the consular section is only processing:

* Citizen Services
* Immigrant Visas

those are the services presented to customers.

---

# 10. Customer Identification

Before generating a ticket, the customer must provide a first name.

Example:

```text
Immigrant Visa Services

Please enter your first name:

[ Jean                 ]

[ Get Ticket ]
```

The first name should be validated before ticket creation.

At minimum:

* Required
* Trimmed
* Reasonable maximum length
* No empty/whitespace-only values

The customer does not provide:

* Password
* Email
* Phone number
* Username
* Account credentials

---

# 11. Ticket Generation

Ticket numbers are generated by the server.

The customer must never be able to select a ticket number.

Example:

```text
Customer:

First name: Jean
Service: Immigrant Visa

        ↓

Server

        ↓

Ticket: IV-042
```

Ticket generation must be atomic to avoid duplicate ticket numbers.

---

# 12. Ticket Contents

A printed ticket should contain enough information for operational identification.

Example:

```text
--------------------------------
          INTEL-Q

    Immigrant Visa Services

Ticket: IV-042
Name: Jean

Issued: 09:42

Please wait for your ticket
to be called.
--------------------------------
```

The ticket may also contain:

* Organization name
* Service name
* Date
* Ticket number
* First name
* Issue time
* Instructions

If generated from a customer's phone, the ticket should provide an option to download or print it.

---

# 13. Customer Privacy

The customer's first name is operational information and should not be unnecessarily exposed.

The public customer display should not show:

```text
Jean — IV-042
```

Instead, it should display:

```text
NOW SERVING

IV-042

WINDOW 3
```

The first name should primarily be available to authorized staff and printed on the customer's ticket.

The first name is an operational identifier, not a formal identity-verification mechanism.

Where consular procedures require identity verification, staff must continue to perform the required document or identity checks.

---

# 14. Ticket Lifecycle

A ticket represents a customer moving through one or more service stages.

Example:

```text
Ticket Created
      ↓
INTAKE
      ↓
INTERVIEW
      ↓
PAYMENT
      ↓
DELIVERY
      ↓
COMPLETED
```

However, the workflow must support non-linear movement.

Example:

```text
INTERVIEW
    ↓
ON_HOLD
    ↓
INTERVIEW
```

or:

```text
PAYMENT
    ↓
INTERVIEW
```

if operational circumstances require the ticket to return to an earlier stage.

---

# 15. Ticket Status

The ticket status represents the customer's current operational queue.

For example:

```text
WAITING
CALLED
IN_SERVICE
ON_HOLD
INTERVIEW
PAYMENT
DELIVERY
COMPLETED
```

The exact status configuration should be determined by the configured service workflow.

A service may have different statuses from another service.

For example:

```text
Immigrant Visa

INTAKE
INTERVIEW
PAYMENT
DELIVERY
ON_HOLD
```

while:

```text
Notarials

INTAKE
PROCESSING
PAYMENT
COMPLETED
```

The application should therefore avoid hard-coding consular-specific workflow assumptions into the core queue engine.

---

# 16. Ticket Status Transitions

A status transition must be recorded.

Example:

```text
Ticket IV-042

INTAKE
  ↓
INTERVIEW
```

The system records:

* Previous status
* New status
* Timestamp
* Staff member
* Relevant window

This creates an operational history for the ticket.

---

# 17. Waiting Time

The system must calculate how long a ticket spends in each stage.

Example:

```text
Ticket: IV-042

Intake:
09:42 → 10:01
19 minutes

Interview:
10:01 → 10:35
34 minutes

Payment:
10:35 → 10:44
9 minutes

Delivery:
10:44 → 10:50
6 minutes
```

Total:

```text
Total processing/waiting time:
68 minutes
```

The underlying system should retain timestamps rather than only storing the calculated duration.

This allows reporting and analysis later.

---

# 18. Ticket History

Each status change should produce a history record.

Conceptually:

```text
TicketHistory

ticketId
previousStatus
newStatus
changedAt
staffId
windowId
```

This allows the application to reconstruct the complete lifecycle of a ticket.

---

# 19. Staff Workflow

A staff member logs in and accesses the service/queue management interface.

The interface should allow them to see relevant pending tickets.

Example:

```text
IMMIGRANT VISA — INTAKE

Waiting:

IV-041
IV-042
IV-043

[ Call Next ]
```

When the staff member calls the next ticket:

```text
IV-041
```

the ticket becomes the active ticket.

The staff member's window is associated with the call.

---

# 20. Calling a Ticket

When a ticket is called:

1. The ticket is selected.
2. Its status changes appropriately.
3. The current window is recorded.
4. The call timestamp is recorded.
5. The customer display updates in real time.
6. An audible announcement is played.

Example customer display:

```text
NOW SERVING

IV-041

WINDOW 2
```

Audio:

> "Ticket I-V zero four one, please proceed to window two."

The actual voice implementation should use browser/device-supported text-to-speech or another appropriate audio service.

---

# 21. Customer Display

The Customer Display is a public endpoint.

It should show:

* Currently called tickets
* Window numbers
* Relevant service information
* Next pending tickets where appropriate

Example:

```text
NOW SERVING

IV-041       WINDOW 2
IV-038       WINDOW 4

NEXT

IV-042
IV-043
```

The interface must automatically update when staff call tickets.

No customer login is required.

---

# 22. Real-Time Updates

Queue operations are time-sensitive.

The customer display should not require users to manually refresh the browser.

The application should eventually use a real-time mechanism such as:

* WebSockets
* Server-Sent Events
* Managed realtime infrastructure
* Appropriate database/event subscriptions

For the initial MVP, polling may be acceptable if necessary, but the architecture should allow migration to true realtime communication.

---

# 23. Completing a Ticket

The final service window completes the customer's journey.

For example:

```text
DELIVERY
   ↓
COMPLETED
```

Once completed, the ticket should no longer appear in active queues.

The system should retain its historical information for reporting rather than physically destroying the underlying database record.

The phrase "destroy the ticket" therefore means:

> **Remove the ticket from active operational queues while retaining the historical record required for auditing and analytics.**

This is important for data integrity.

---

# 24. Staff Windows

A window represents the physical service point where a staff member serves a customer.

Example:

```text
Window 1
Window 2
Window 3
Window 4
```

When a staff member calls a ticket, the system records the window.

Example:

```text
Ticket: IV-042
Status: INTERVIEW
Window: 3
Staff: Staff Member
Called: 10:01
```

A staff member should be able to work from an authorized service/queue management page rather than being permanently tied to a single service.

---

# 25. Service and Queue Separation

The application should distinguish between:

### Service

What the customer is requesting.

Example:

```text
Immigrant Visa
```

### Queue/Status

Where the ticket currently is in the operational workflow.

Example:

```text
Interview
```

Therefore:

```text
Service:
Immigrant Visa

Current Queue:
Interview
```

This distinction is essential.

A customer should select the **service**, not an internal operational queue.

---

# 26. Existing Database Structure

The existing core data model should remain intact.

The current architecture already provides the foundation around:

* User
* Branch
* QueueTicket

The consular workflow should be implemented around this existing structure rather than replacing the database architecture unnecessarily.

Where additional operational data is required, it should be added carefully and consistently with the existing Prisma/PostgreSQL architecture.

The project should avoid introducing a separate customer-account model merely to store ticket holders.

---

# 27. Customer Accounts

Customer accounts are outside the current MVP.

Do not implement:

```text
Customer Registration
Customer Login
Customer Password
Customer Profile
```

for the public ticketing workflow.

A ticket is sufficient to participate in the queue.

---

# 28. Security

All staff and administrative operations must be protected by server-side authentication and authorization.

Never rely solely on:

* Hidden buttons
* Client-side role checks
* Disabled UI elements
* Route visibility

The API must independently verify:

```text
Authenticated?
      ↓
Correct role?
      ↓
Authorized operation?
```

Public ticket creation is intentionally unauthenticated but must still validate all submitted data server-side.

---

# 29. Validation

Use Zod for request validation.

The same principle already used by:

```text
lib/validations/
```

should continue to be followed.

Customer ticket creation should validate at least:

```text
firstName
serviceId
```

The server must never trust client-side validation.

---

# 30. API Architecture

The application should maintain clear separation between:

### Public APIs

Used by customers and public displays.

Examples:

```text
GET  /api/services
POST /api/tickets
GET  /api/display
```

### Staff APIs

Used for queue operations.

Examples:

```text
GET   /api/queues
POST  /api/tickets/:id/call
PATCH /api/tickets/:id/status
POST  /api/tickets/:id/complete
```

### Administrative APIs

Used for configuration.

Examples:

```text
POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id
POST   /api/windows
PATCH  /api/windows/:id
```

Exact endpoints should be finalized as implementation progresses.

---

# 31. Current Branch Functionality

The existing branch API supports:

```text
GET    /api/branches
POST   /api/branches
GET    /api/branches/:id
PATCH  /api/branches/:id
DELETE /api/branches/:id
```

Branch management is restricted to authenticated staff/administrators as appropriate.

The existing branch components include:

```text
BranchCard
BranchForm
BranchList
CreateBranchForm
```

These should continue to follow the established API and Prisma architecture.

---

# 32. UI Components

Components should remain modular.

For example:

```text
components/
├── auth/
├── branch/
├── queue/
├── ticket/
├── services/
├── display/
└── admin/
```

Avoid placing the entire queue-management application inside one large component.

Each component should have a clear responsibility.

---

# 33. Public Customer Interface

The customer interface should be optimized for:

* Touch screens
* Tablets
* Smartphones
* Simple navigation
* Large buttons
* High contrast
* Minimal typing
* Clear instructions

The customer should be able to obtain a ticket within a few interactions.

The interface must not assume that every customer owns a smartphone.

---

# 34. Ticket Printing

The ticket-generation flow should support:

### Touch-screen/kiosk

```text
Generate Ticket
      ↓
Print
```

### Smartphone

```text
Generate Ticket
      ↓
Download Ticket
      ↓
Optional Print
```

The downloadable ticket should be suitable for showing to staff if permitted by the operating environment.

---

# 35. Phone Restrictions

Some consular sections may prohibit phones inside the premises.

The application must therefore not depend on a customer's phone for queue participation.

The physical waiting-area device should provide the complete ticket-generation workflow.

Example:

```text
Touchscreen iPad
       ↓
Services
       ↓
First Name
       ↓
Generate Ticket
       ↓
Printer
       ↓
Paper Ticket
```

The customer's first name and ticket number printed on the paper ticket provide the operational reference.

---

# 36. Public Display Privacy

Do not expose unnecessary personal information on public screens.

Preferred:

```text
NOW SERVING

IV-042
WINDOW 3
```

Avoid:

```text
NOW SERVING

Jean Tshibasu
IV-042
WINDOW 3
```

Only the minimum operational information required should be publicly visible.

---

# 37. Analytics

The system should retain timestamp information sufficient to calculate:

* Time waiting for service
* Time being served
* Time on hold
* Time between service stages
* Total ticket lifecycle duration
* Average service time
* Average waiting time
* Queue volume
* Service demand
* Window utilization
* Tickets completed
* Tickets placed on hold
* Tickets returned to previous stages

This data will become important for operational decision-making.

---

# 38. Auditability

Important actions should be traceable.

Examples:

```text
Ticket created
Ticket called
Ticket recalled
Status changed
Ticket placed on hold
Ticket resumed
Ticket completed
```

Where applicable, record:

* User/staff member
* Timestamp
* Previous state
* New state
* Window
* Service

---

# 39. Cloud Deployment

Intel-Q is intended to be deployed as a cloud-based application.

The architecture should therefore keep:

* Database credentials server-side
* Authentication secrets server-side
* API authorization server-side
* Environment variables secure
* Client-side code free of sensitive credentials

The application should be compatible with the project's existing Next.js deployment environment.

---

# 40. Development Stack

The current project uses:

* Next.js
* React
* TypeScript
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* NextAuth/Auth.js authentication
* Zod validation
* bcrypt password hashing

These technologies should remain consistent unless a deliberate architectural decision is made.

---

# 41. Development Rules

When implementing new functionality:

1. Reuse existing Prisma models where possible.
2. Reuse existing authentication infrastructure.
3. Validate requests with Zod.
4. Validate data on the server.
5. Keep customer workflows unauthenticated.
6. Keep staff/admin workflows authenticated.
7. Keep authorization on the server.
8. Do not expose customer names on public displays.
9. Generate ticket numbers server-side.
10. Store timestamps for status transitions.
11. Do not physically delete completed tickets when historical data is required.
12. Keep components small and reusable.
13. Avoid hard-coding the consular workflow into generic queue logic.
14. Keep the UI accessible and touch-friendly.
15. Avoid unnecessary changes to the existing database architecture.

---

# 42. Target Architecture

The intended high-level architecture is:

```text
                    ┌─────────────────────┐
                    │   Customer Welcome  │
                    │       Page          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Services Page    │
                    │     Public           │
                    └──────────┬──────────┘
                               │
                     Select Service
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Enter First Name  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Generate Ticket    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
             Print Ticket              Download
                  │
                  ▼
             Waiting Area
                  │
                  │
                  ▼
        ┌───────────────────────┐
        │   Staff Queue UI      │
        │                       │
        │ Call / Status / Hold  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Customer Display      │
        │                       │
        │ Ticket + Window       │
        │ Audio Announcement    │
        └───────────────────────┘
```

---

# 43. MVP Success Criteria

The MVP should be considered operationally successful when the following workflow works from beginning to end:

```text
1. Staff logs in.

2. Staff opens a service.

3. Service becomes visible publicly.

4. Customer opens the Services page.

5. Customer selects a service.

6. Customer enters a first name.

7. Server generates a unique ticket.

8. Customer prints or downloads the ticket.

9. Ticket appears in the appropriate queue.

10. Staff calls the ticket.

11. Customer display updates.

12. Audible announcement plays.

13. Staff changes the ticket status.

14. Ticket appears in the next appropriate queue.

15. Another staff member calls the ticket.

16. The process repeats.

17. Final staff member completes the ticket.

18. Ticket disappears from active queues.

19. Ticket history remains available for analytics.

20. Timing data is retained for reporting.
```

---

# 44. Important Product Principle

Intel-Q should not be designed around the assumption that the customer owns a smartphone.

The smartphone is an optional convenience.

The core workflow must work using:

```text
Public Services Page
        +
Touchscreen/Kiosk
        +
Printer
        +
Paper Ticket
        +
Customer Display
        +
Staff Windows
```

This makes Intel-Q suitable for real-world environments where customers may have limited access to technology or where phones are prohibited.

---

# 45. Future Extensibility

Although the current implementation is focused on the consular use case, the queue engine should remain sufficiently generic to support other organizations later.

The system should eventually allow configuration of:

* Organization name
* Logo
* Theme colors
* Services
* Service workflows
* Queue statuses
* Number of windows
* Window names/numbers
* Staff members
* Display configuration
* Ticket prefixes
* Operating hours

However, these configuration capabilities should be introduced incrementally.

The current MVP should prioritize a stable and professional queue workflow before introducing a full multi-tenant configuration system.

---

# 46. Current Implementation Priority

Development should proceed in this order:

```text
1. Authentication
        ↓
2. Public Services
        ↓
3. Customer first-name ticket creation
        ↓
4. Ticket numbering
        ↓
5. Staff queue management
        ↓
6. Ticket calling
        ↓
7. Customer display
        ↓
8. Audio announcements
        ↓
9. Status transitions
        ↓
10. Ticket history/timing
        ↓
11. Completion/archive
        ↓
12. Analytics
        ↓
13. Administrative configuration
```

The immediate goal is not to build every possible feature.

The immediate goal is to build a **reliable end-to-end queue lifecycle** that can be demonstrated and used operationally.
