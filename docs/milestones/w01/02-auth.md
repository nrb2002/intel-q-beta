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
