---
name: differential-review
description: "Security-focused differential code review. Use for PRs, commits, diffs, security audit. Risk-first, evidence-based analysis."
---
# Differential Security Review

Security-focused code review for PRs, commits, and diffs.

## When to Use
- Reviewing PRs before merge
- Security audit of code changes
- Pre-commit validation
- Assessing blast radius of changes

## Process
1. Classify codebase size → select depth strategy
2. Build baseline context from git history
3. Review risk-first: auth, crypto, value transfer, external calls
4. Calculate blast radius (transitive callers)
5. Generate markdown report

## Inputs
- Git diff, PR, or commit hash
- Codebase context

## Output
- Markdown report with findings, severity, evidence, recommendations

## Success Criteria
- All findings backed by line numbers and attack scenarios
- Blast radius calculated
- Coverage limits stated honestly
