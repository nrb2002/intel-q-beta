Title: Real-time Updates (Polling / Websockets)

Description:
Add real-time or near-real-time updates so the queue dashboard reflects changes made by other staff members without manual refresh.

Acceptance Criteria:
- Implement a simple polling fallback and document how to migrate to WebSockets or Server-Sent Events.
- Dashboard reflects created/updated/deleted entries within a short timeframe (e.g., <5s) when polling is enabled.
- Data consistency is maintained when multiple clients update the same entry.

Priority: P3
Labels: frontend, realtime, P3

Checklist:
- [ ] Implement polling mechanism
- [ ] Document WebSocket/SSE migration path
- [ ] Add tests for concurrent updates scenario
