# Milestone 05 — Staff Window & Queue Management

## Objective
Give staff a fast operational interface for working at service windows.

## Staff Flow
Login → Select Window → Select Service/Queue → View Pending Tickets → Call Ticket

## Tasks
- [ ] Build staff dashboard.
- [ ] Display available service queues.
- [ ] Allow staff to identify/select their window.
- [ ] Show pending tickets for the selected queue.
- [ ] Show currently serving ticket.
- [ ] Show next pending ticket.
- [ ] Implement call-ticket operation.
- [ ] Implement recall where appropriate.
- [ ] Prevent two staff members from claiming the same ticket.
- [ ] Perform ticket claiming atomically on the backend.
- [ ] Add loading states.
- [ ] Add success/error feedback.
- [ ] Ensure staff do not need to manage customer profiles.

## Operational View
```text
Window 03
Immigrant Visas — Interview

Currently Serving
IV-041

Next Pending
IV-042

Waiting
IV-043
IV-044
IV-045
```

## Acceptance Criteria
- [ ] Staff can select a window.
- [ ] Staff can select an appropriate queue.
- [ ] Pending tickets are visible.
- [ ] Staff can call a ticket.
- [ ] Ticket assignment is protected against race conditions.
- [ ] The ticket immediately becomes unavailable to competing staff.
- [ ] The interface is usable on tablets and desktops.

## Deliverables
- Staff dashboard.
- Window selection.
- Queue management interface.
- Secure call-ticket API.
