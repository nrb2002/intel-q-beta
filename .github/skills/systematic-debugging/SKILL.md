---
name: systematic-debugging
description: "Root-cause-first debugging methodology. Use for ANY bug, test failure, unexpected behavior. Always investigate before fixing."
---
# Systematic Debugging

Root cause investigation before ANY fix attempt.

## Iron Law
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

## When to Use
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures

## Process
1. Read error messages carefully (stack traces contain the answer)
2. Reproduce consistently
3. Trace backward through call chain to original trigger
4. Form 2-3 hypotheses, rank by likelihood
5. Test most likely hypothesis first
6. Fix at SOURCE, not at symptom
7. Write regression test
8. Verify full test suite still passes

## Constraints
- Do not propose fixes before investigation is complete
- "Just one quick fix" is forbidden
- Systematic is faster than thrashing

## Success Criteria
- Root cause identified with evidence
- Regression test written
- Full suite passes
