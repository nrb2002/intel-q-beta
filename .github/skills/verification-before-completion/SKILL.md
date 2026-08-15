---
name: verification-before-completion
description: "Evidence-based completion gate. Use before claiming any work is complete, fixed, or passing. No claims without fresh verification."
---
# Verification Before Completion

Evidence before claims, always.

## When to Use
- About to claim work is complete
- About to commit or create PR
- After fixing a bug
- After implementing a feature

## Iron Law
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

## Gate Function
1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh)
3. READ: Full output, exit code, failure count
4. VERIFY: Does output confirm claim?
5. ONLY THEN: Make the claim

## Success Criteria
- Every claim backed by fresh command output
- Exit codes checked
- Zero failures explicitly confirmed
