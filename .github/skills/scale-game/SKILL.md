---
name: scale-game
description: "Test at extreme scales to expose fundamental truths. Use when uncertain about scalability, edge cases unclear, validating architecture."
---
# Scale Game

Test at 1000x extremes to find what breaks and what survives.

## When to Use
- Validating architecture for production
- Edge cases unclear
- "It works in dev" but unsure about production
- Need to find scaling limits

## Process
1. Pick dimension (volume, speed, users, duration, failure rate)
2. Test minimum — what if 1000x smaller/faster/fewer?
3. Test maximum — what if 1000x bigger/slower/more?
4. Note what breaks — where do limits appear?
5. Note what survives — what's fundamentally sound?

## Dimensions
| Dimension | Test At | Reveals |
|-----------|---------|---------|
| Volume | 1 vs 1B items | Algorithmic complexity |
| Speed | Instant vs 1 year | Async requirements |
| Users | 1 vs 1B users | Concurrency issues |
| Duration | Milliseconds vs years | Memory leaks |
| Failure rate | Never vs always | Error handling adequacy |

## Success Criteria
- Limits identified and documented
- Fundamental design validated or invalidated
- Scaling recommendations made
