Title: Create Entry Form & Validation

Description:
Implement the UI form and API validation for creating new queue entries.

Acceptance Criteria:
- Form requires `name` and `serviceType` and shows inline validation errors.
- Submitting valid data creates a queue entry visible on the dashboard.
- API returns clear error messages for invalid/missing fields.

Priority: P1
Labels: frontend, validation, P1

Checklist:
- [ ] Build form component
- [ ] Add client-side validation
- [ ] Integrate with `POST /api/queues`
- [ ] Test UX error states
