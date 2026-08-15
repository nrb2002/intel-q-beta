---
name: test-driven-development
description: "TDD red-green-refactor methodology. Use when implementing any feature, bugfix, or behavior change. Test BEFORE code."
---
# Test-Driven Development

Write the test first. Watch it fail. Write minimal code to pass.

## When to Use
- New features
- Bug fixes
- Refactoring
- Behavior changes

## Process
1. RED: Write one test for next behavior. Run it — MUST fail.
2. GREEN: Write MINIMUM code to pass. Run test — must pass.
3. REFACTOR: Improve quality, tests must still pass.
4. COMMIT: Test + implementation together.
5. REPEAT for next behavior.

## Constraints
- No production code without a failing test first
- Test behavior, not implementation details
- One behavior per test

## Success Criteria
- Every behavior has a test seen to fail first
- Red-green-refactor cycle followed
- All tests pass
