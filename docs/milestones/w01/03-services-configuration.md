# Milestone 03 — Services & Queue Configuration

## Objective
Make services and queue stages database-driven instead of hardcoded.

## Initial Consular Configuration
Services:
- Citizen Services
- Immigrant Visas
- Non-immigrant Visas
- Notarials
- Official/Diplomatic Visas

Example stages:
- Intake
- Interview
- Payment
- Delivery
- On Hold

These are initial data, not hardcoded application logic.

## Tasks
- [ ] Review existing Prisma data model before changing it.
- [ ] Implement service retrieval.
- [ ] Implement service creation/update if supported by the current schema.
- [ ] Implement service activation/deactivation.
- [ ] Implement queue-stage retrieval.
- [ ] Implement queue-stage configuration.
- [ ] Support service-specific stages.
- [ ] Support display ordering.
- [ ] Support ticket prefixes if the schema supports them.
- [ ] Validate service and stage data with Zod.
- [ ] Ensure only active services appear publicly.
- [ ] Add admin UI for configuration where required.

## Design Rule
Do not write logic such as:

```text
if service === "Immigrant Visa"
```

Use database/configuration data instead.

## Acceptance Criteria
- [ ] Admin can view configured services.
- [ ] Services can be enabled/disabled.
- [ ] Services can have multiple queue stages.
- [ ] Public users only see active services.
- [ ] Queue stages are retrieved dynamically.
- [ ] No core workflow depends on hardcoded consular service names.

## Deliverables
- Service configuration.
- Queue-stage configuration.
- Initial consular seed/configuration data.
