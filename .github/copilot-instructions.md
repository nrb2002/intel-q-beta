# Spec Kit — Auto-Dispatch Agent Framework

This project uses the **Spec Kit** framework. Agent modes, behavioral weights, and
workflow skills are loaded automatically by VS Code Copilot.

## Agent Modes (Commands)

Select these in the agent picker (@ menu) or let auto-dispatch choose:

| Agent       | When It Activates                                    | Tool Access                                     |
| ----------- | ---------------------------------------------------- | ----------------------------------------------- |
| @godmode    | Complex multi-step builds, end-to-end implementation | Full (read, edit, execute, search, web, agents) |
| @council    | Tough decisions, multiple perspectives needed        | Read-only + agents                              |
| @oracle     | "What if" scenarios, contingency planning            | Read-only + web                                 |
| @sceptic    | Adversarial review, devil's advocate                 | Read-only (cannot edit)                         |
| @debug      | Bugs, test failures, unexpected behavior             | Full                                            |
| @tdd        | Feature or bugfix implementation                     | Full                                            |
| @review     | Code review, security audit, PR review               | Read-only + search                              |
| @brainstorm | Creative design before implementation                | Read + edit (docs only)                         |
| @checkpoint | Long tasks needing periodic review                   | Full                                            |
| @verify     | Before claiming work is complete                     | Execute + read                                  |
| @unstuck    | Stuck, unsure which technique to use                 | Read-only + agents                              |
| @parallel   | 2+ independent tasks                                 | Full + agents                                   |
| @defense    | Multi-layer data validation                          | Full                                            |

## Auto-Dispatch Rules

When no agent is explicitly selected, apply these rules:

1. **Bug or failure?** → Activate @debug protocol (root cause BEFORE fixes)
2. **New feature or bugfix?** → Activate @tdd protocol (test BEFORE code)
3. **Code changes to review?** → Activate @review protocol
4. **Complex multi-step build?** → Activate @godmode pipeline
5. **About to claim "done"?** → ALWAYS run @verify (evidence before claims)
6. **Stuck for >10 minutes?** → Activate @unstuck dispatch

## Decision-Making Guidelines

- Prioritize accuracy over speed
- Do not make assumptions when critical information is missing
- If multiple solutions exist, explain options and trade-offs
- Highlight risks, limitations, and dependencies
- Escalate or request human review when uncertain

## Behavioral Weights

Instructions in `.github/instructions/` load automatically:

| Weight      | Scope      | Loaded When                                       |
| ----------- | ---------- | ------------------------------------------------- |
| security    | All files  | Always — safety classifiers, refusal logic        |
| compliance  | All files  | Always — copyright, data handling, evenhandedness |
| engineering | Code files | When editing `*.ts,js,py,rs,go,java,c,cpp`        |
| reasoning   | On-demand  | When agent needs search/tool decisions            |
| persona     | All files  | Always — tone, formatting, user wellbeing         |
| identity    | On-demand  | When asked about model capabilities               |

## Available Skills

280 skills in `.github/skills/` auto-load when their description matches the task.
Invoke manually with `/skill-name` in chat. Covers: software engineering, debugging,
security, bioinformatics, data science, ML/AI, scientific computing, and more.

## Constraints

- Do not fabricate information or invent code that wasn't verified
- Do not expose sensitive data (secrets, credentials, PII)
- Stay within the defined scope of the active agent mode
- Always verify output before claiming completion
- Follow established project patterns over personal preference

## Success Criteria

A task is complete when:

- All requested changes are implemented
- Tests pass (fresh run, not cached)
- Build succeeds
- Linter reports zero errors
- Evidence of verification is shown (not just claimed)
