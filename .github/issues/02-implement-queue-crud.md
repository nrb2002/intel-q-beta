Title: Implement Queue CRUD API

Description:
Create API endpoints for creating, reading, updating, and deleting queue entries. Ensure operations are authenticated and validate input.

Acceptance Criteria:
- GET `/api/queues` returns a list of queue entries for the authenticated user's location.
- POST `/api/queues` creates a queue entry with required fields (name, serviceType).
- GET `/api/queues/:queueId` returns a single entry.
- PUT `/api/queues/:queueId` updates allowed fields (status, name, serviceType).
- DELETE `/api/queues/:queueId` removes an entry.

Priority: P1
Labels: backend, api, P1

Checklist:
- [ ] Define queue data model
- [ ] Implement route handlers
- [ ] Add server-side validation and auth checks
- [ ] Write basic integration tests
