# Milestone 10 — Testing, Deployment & Documentation

## Objective
Validate the complete application and deploy a production-ready MVP within the 10-day schedule.

## End-to-End Test

### Administrator
- [ ] Log in.
- [ ] Configure services.
- [ ] Configure queue stages.
- [ ] Enable/disable a service.
- [ ] Verify configuration appears publicly.

### Customer
- [ ] Open Welcome Page.
- [ ] Scan/open QR code.
- [ ] Select service.
- [ ] Enter first name.
- [ ] Generate ticket.
- [ ] Print ticket.
- [ ] Verify mobile ticket behavior.
- [ ] Wait for ticket call.
- [ ] Verify display and voice announcement.
- [ ] Follow ticket through multiple stages.

### Staff
- [ ] Log in.
- [ ] Select window.
- [ ] Select service/queue.
- [ ] View pending tickets.
- [ ] Call ticket.
- [ ] Serve ticket.
- [ ] Move ticket to another stage.
- [ ] Put ticket On Hold.
- [ ] Resume ticket.
- [ ] Move ticket backward where allowed.
- [ ] Complete ticket.

### Analytics
- [ ] Verify ticket history.
- [ ] Verify stage timestamps.
- [ ] Verify waiting-time calculations.
- [ ] Verify processing-time calculations.
- [ ] Verify total-time calculations.
- [ ] Verify aggregate metrics.

## Technical Checks
- [ ] Run TypeScript check.
- [ ] Run production build.
- [ ] Verify Prisma generation.
- [ ] Verify migrations.
- [ ] Verify production environment variables.
- [ ] Verify database connection.
- [ ] Test public routes.
- [ ] Test protected routes.
- [ ] Test unauthorized API requests.
- [ ] Test concurrent ticket calls.
- [ ] Test duplicate ticket submissions.
- [ ] Test empty queues.
- [ ] Test disabled services.
- [ ] Test missing/invalid IDs.
- [ ] Test error responses.

## Deployment
- [ ] Deploy application to the selected hosting platform.
- [ ] Configure production PostgreSQL.
- [ ] Configure environment variables.
- [ ] Apply production database migrations.
- [ ] Verify production authentication.
- [ ] Verify production public Services Page.
- [ ] Verify production display endpoint.
- [ ] Generate/verify production QR code.
- [ ] Perform a complete live workflow test.

## Documentation
- [ ] Update README.
- [ ] Document local development setup.
- [ ] Document environment variables.
- [ ] Document database setup.
- [ ] Document staff workflow.
- [ ] Document administrator workflow.
- [ ] Document customer workflow.
- [ ] Document deployment process.
- [ ] Document known limitations.
- [ ] Document future improvements.

## Final Acceptance Criteria
- [ ] A customer can receive a ticket without creating an account.
- [ ] Staff can operate queues.
- [ ] Tickets can move through multiple stages.
- [ ] Customer display works.
- [ ] Voice announcements work where supported.
- [ ] Completed tickets remain available for analysis.
- [ ] Staff/admin authorization works.
- [ ] Production deployment is functional.
- [ ] No known critical defects remain.

## Deliverables
- Production deployment.
- Updated README/developer documentation.
- Final test checklist.
- Demonstration-ready application.
