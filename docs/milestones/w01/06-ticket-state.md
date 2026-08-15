# Milestone 06 — Ticket State Machine & Workflow

## Objective
Implement the ticket lifecycle and support movement between queue stages, including backward movement and On Hold.

## Concepts
A ticket has:
1. A general operational status.
2. A current queue stage.

Example:

```text
Ticket: IV-042
Status: SERVING
Current Stage: Interview
```

## Suggested Statuses
- WAITING
- CALLED
- SERVING
- ON_HOLD
- COMPLETED

Use the project's existing Prisma enum/model where applicable.

## Tasks
- [ ] Define valid ticket statuses.
- [ ] Define valid stage transitions.
- [ ] Allow tickets to move between configured stages.
- [ ] Allow tickets to move backward where operationally necessary.
- [ ] Support On Hold.
- [ ] Support resuming an On Hold ticket.
- [ ] Record stage entry time.
- [ ] Record stage exit/completion time.
- [ ] Ensure only authorized staff can transition tickets.
- [ ] Validate transitions server-side.
- [ ] Prevent invalid status/stage combinations.
- [ ] Preserve ticket identity throughout the workflow.

## Example
```text
Intake
  ↓
Interview
  ↓
Payment
  ↓
Delivery
  ↓
Completed
```

Alternative:
```text
Interview
  ↓
On Hold
  ↓
Interview
```

## Acceptance Criteria
- [ ] A ticket can move from one configured stage to another.
- [ ] A ticket can move backward when allowed.
- [ ] On Hold works.
- [ ] Resume works.
- [ ] Ticket history/timing data is persisted.
- [ ] Invalid transitions are rejected.
- [ ] Final completion is distinct from intermediate stage completion.

## Deliverables
- Ticket state machine.
- Transition API.
- Staff transition controls.
- Timing/event persistence.
