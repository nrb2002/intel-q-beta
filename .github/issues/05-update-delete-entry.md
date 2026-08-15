Title: Update & Delete Entry (UI & API)

Description:
Enable staff to update entry details and delete entries via UI and API.

Acceptance Criteria:
- PUT `/api/queues/:queueId` updates allowed fields and returns the updated entry.
- DELETE `/api/queues/:queueId` removes the entry and returns a 204 response.
- UI supports editing an entry inline or via a modal and confirms deletion.

Priority: P2
Labels: frontend, backend, P2

Checklist:
- [ ] Implement update API
- [ ] Implement delete API
- [ ] Add edit/delete UI flows and confirmations
- [ ] Add tests for update/delete
