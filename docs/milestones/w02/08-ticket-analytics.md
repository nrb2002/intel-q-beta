# Milestone 08 — Ticket Completion & Analytics

## Objective
Complete the customer journey while retaining historical timing data for analysis.

## Completion Model
Operationally, a completed ticket should disappear from active queues but remain in the database as historical data.

```text
Active Queue
    ↓
Completed
    ↓
Historical Data
```

## Tasks
- [ ] Implement final ticket completion.
- [ ] Remove completed tickets from active operational views.
- [ ] Retain completed tickets in PostgreSQL.
- [ ] Record final completion timestamp.
- [ ] Calculate stage waiting time.
- [ ] Calculate stage processing time.
- [ ] Calculate total customer journey time.
- [ ] Preserve timing information for every relevant stage.
- [ ] Add basic admin statistics.
- [ ] Add daily ticket counts.
- [ ] Add service-level counts.
- [ ] Add average waiting time.
- [ ] Add average processing time.
- [ ] Add average total time.

## Useful Metrics
- Total tickets.
- Completed tickets.
- Waiting tickets.
- On Hold tickets.
- Average wait time.
- Average stage duration.
- Average total processing time.
- Tickets per service.
- Tickets per queue.
- Tickets per window.

## Acceptance Criteria
- [ ] Final staff member can complete a ticket.
- [ ] Completed tickets no longer appear as pending.
- [ ] Historical records remain available.
- [ ] Timing calculations are based on persisted timestamps.
- [ ] Basic analytical metrics can be viewed by administrators.

## Deliverables
- Ticket completion workflow.
- Historical ticket data.
- Basic analytics dashboard/report.
