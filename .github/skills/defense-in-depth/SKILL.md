---
name: defense-in-depth
description: "Multi-layer data validation. Use when fixing validation bugs, data flows through multiple layers, need to make bugs structurally impossible."
---
# Defense-in-Depth Validation

Validate at EVERY layer data passes through. Make bugs structurally impossible.

## When to Use
- Fixing bugs caused by invalid data
- Data flowing through multiple system layers
- Need structural prevention, not just patching

## The Four Layers
1. **Entry Point** — Reject invalid input at API boundary
2. **Business Logic** — Domain rules, invariants, state preconditions
3. **Environment Guards** — File paths exist, dirs writable, connections live
4. **Debug Logging** — Log actual values when other layers fail

## Success Criteria
- Validation at all four layers
- Bug is impossible, not just patched
- Each layer catches different failure modes
