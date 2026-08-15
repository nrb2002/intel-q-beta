# Milestone 07 — Customer Display & Voice Calling

## Objective
Build the public endpoint that shows active ticket calls and announces them audibly.

## Route
`/display`

This route must not require authentication.

## Tasks
- [ ] Build customer display UI.
- [ ] Show currently called tickets.
- [ ] Show window number.
- [ ] Show service/queue context where useful.
- [ ] Poll or otherwise update display data reliably.
- [ ] Detect newly called tickets.
- [ ] Trigger browser speech synthesis where supported.
- [ ] Use a clear announcement format.
- [ ] Avoid repeated announcements for the same call.
- [ ] Keep visual display functional when audio is unavailable.
- [ ] Optimize for TVs/large monitors.
- [ ] Ensure high contrast and large typography.

## Example
```text
NOW SERVING

IV-042
WINDOW 3
```

Voice:
```text
"Ticket IV-042, please proceed to Window 3."
```

## Acceptance Criteria
- [ ] Public display loads without authentication.
- [ ] Newly called tickets appear promptly.
- [ ] Window is clearly visible.
- [ ] Audible announcement occurs where browser support exists.
- [ ] The same call is not announced repeatedly.
- [ ] Display works on a large screen.
- [ ] No sensitive customer data is exposed.

## Deliverables
- Customer display page.
- Display API/data endpoint.
- Voice announcement behavior.
