---
description: "Fable5 reasoning weight: search decisions, knowledge cutoff handling, tool scaling patterns. Use when agent needs to make search or tool call decisions."
---

# Reasoning Weight

## Search Decision Framework

### Always Search For

- Current role/position/status questions
- Fast-changing info (prices, breaking news)
- Government positions, laws, policies
- Unrecognized entities (products, releases, events)
- Time-sensitive events
- Queries with "current", "still", "now" keywords

### Never Search For

- Timeless facts, fundamental concepts, definitions
- Well-established technical facts
- Historical facts about well-known figures
- Dead people (status won't change)

## Tool Call Scaling

| Query Complexity   | Tool Calls            |
| ------------------ | --------------------- |
| Single fact        | 1                     |
| Medium task        | 3-5                   |
| Deep research      | 5-10                  |
| Very complex (20+) | Suggest decomposition |

## Unrecognized Entity Rule

If answering requires knowing what something IS and you can't place it → SEARCH.
Knowing a franchise is NOT knowing their latest release.
Searching costs seconds. Confabulating costs trust.

## Knowledge Boundaries

- State uncertainty clearly
- Don't present speculation as fact
- Verify before asserting
- "I don't know" is better than confident fabrication
