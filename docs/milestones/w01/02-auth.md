# Milestone 02 — Authentication & Authorization

## Objective
Implement clear staff and administrator authentication while keeping the customer experience completely public.

## Scope
Customer ticket issuing must not require an account. Staff and administrators must authenticate before accessing protected operations.

## Routes
- `/login/staff`
- `/login/admin`
- `/staff`
- `/admin`

## Tasks
- [ ] Reuse the existing authentication infrastructure.
- [ ] Implement staff login route.
- [ ] Implement admin login route.
- [ ] Protect staff routes.
- [ ] Protect admin routes.
- [ ] Enforce role checks server-side.
- [ ] Ensure customers cannot access staff/admin APIs.
- [ ] Ensure STAFF cannot perform ADMIN-only operations.
- [ ] Add clear unauthorized and forbidden responses.
- [ ] Test authenticated and unauthenticated requests.
- [ ] Verify logout/session behavior.

## Authorization Rules
### STAFF
Can:
- [ ] Access staff dashboard.
- [ ] Operate queues.
- [ ] Call tickets.
- [ ] Transition tickets.
- [ ] Complete tickets where permitted.

### ADMIN
Can:
- [ ] Access admin dashboard.
- [ ] Configure services.
- [ ] Configure queue stages.
- [ ] Manage operational configuration.

## Acceptance Criteria
- [ ] Staff can log in successfully.
- [ ] Admin can log in successfully.
- [ ] Protected pages reject unauthenticated users.
- [ ] Protected APIs reject unauthorized requests.
- [ ] Role restrictions are enforced on the server.
- [ ] Public customer routes remain accessible without authentication.

## Deliverables
- Staff login.
- Admin login.
- Route protection.
- Server-side authorization.


# Authentication & Authorization structure

app/
├── login/
│   ├── staff/
│   │   └── page.tsx
│   └── admin/
│       └── page.tsx
│
├── staff/
│   ├── layout.tsx
│   └── page.tsx
│
├── admin/
│   ├── layout.tsx
│   └── page.tsx
│
└── api/
    └── auth/
        └── [...nextauth]/

lib/
├── auth.ts
├── auth/
│   ├── authorization.ts
│   └── require-role.ts
└── validations/

Important change from the old Intel-Q

We should not make /login the main customer entry point anymore.

The public flow becomes:

Customer
   │
   ▼
Public Welcome Page
   │
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
Print / Download Ticket

Authentication is completely outside that flow:

                    ┌───────────────┐
                    │   Intel-Q     │
                    │ Public Portal │
                    └───────┬───────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       Customer Flow                 Staff/Admin
       No account                    Authentication
             │                             │
             ▼                     ┌───────┴───────┐
       Services/Tickets             ▼               ▼
                                STAFF LOGIN      ADMIN LOGIN
                                    │               │
                                    ▼               ▼
                               /staff            /admin
Authorization model

The server should use a reusable role-checking function rather than duplicating this everywhere:

const isStaff =
  session.user.role === "STAFF" ||
  session.user.role === "ADMIN";

For example:

await requireRole("STAFF");

would allow both STAFF and ADMIN, while:

await requireRole("ADMIN");

would allow administrators only.

This becomes especially important later when we implement:

service configuration,
queue-stage configuration,
window management,
ticket operations,
operational settings.
One thing I want to preserve


## Milestone 02 implementation order

1. Inspect the existing lib/auth.ts and Auth.js configuration
2. Confirm the Prisma User.role enum contains:
CUSTOMER
STAFF
ADMIN
3. Confirm credentials/password authentication works.
4. Add reusable authorization helpers.
5. Create /login/staff.
6. Crete /login/admin.
7. Create /staff.
8. Create /admin.
9. Add server-side route protection.
10. Protect staff/admin API routes.
11. Test role boundaries.
12. Test logout/session expiration.

We'll centralize:

- checking whether a user is logged in;
- checking whether the user is STAFF;
- checking whether the user is ADMIN;
- returning/throwing the appropriate unauthorized or forbidden response;
- making sure an ADMIN can also perform staff operations where appropriate.

For example, the final authorization model will be:

## Area	               Customer	   Staff      Admin

- Public Services	         ✅	      ✅	      ✅
- Print Ticket	            ✅	      ✅	      ✅
- Staff Dashboard	         ❌	      ✅	      ✅
- Queue Operations	      ❌	      ✅       	✅
- Call Ticket	            ❌       	✅       	✅
- Transition Ticket	      ❌       	✅       	✅
- Admin Dashboard	         ❌       	❌       	✅
- Configure Services	      ❌	      ❌       	✅
- Configure Queue Stages	❌	      ❌       	✅
- Manage Windows	         ❌	      ❌       	✅
 