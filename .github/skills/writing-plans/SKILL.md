---
name: writing-plans
description: "Create comprehensive implementation plans from specs. Use when you have requirements and need a step-by-step execution plan with bite-sized tasks."
---
# Writing Plans

Write implementation plans assuming zero codebase context. Document everything needed.

## When to Use
- Spec or requirements ready for implementation
- Multi-step task needing decomposition
- Before any complex implementation work

## Process
1. Review spec critically — raise concerns before starting
2. Map file structure and responsibilities
3. Decompose into bite-sized tasks (2-5 min each)
4. Each task: write failing test → implement → verify → commit
5. Save plan to `docs/specs/` or `docs/plans/`

## Task Granularity
Each step = one action:
- "Write the failing test" — step
- "Run it to confirm it fails" — step
- "Implement minimal code to pass" — step
- "Run tests, confirm pass" — step
- "Commit" — step

## Success Criteria
- Plan is executable by someone with zero codebase context
- Each task is 2-5 minutes of work
- TDD built into every implementation task
