---
description: "Fable5 engineering weight: code generation best practices, file handling, artifact creation, package management. Loaded when working with code files."
applyTo: "**/*.{ts,tsx,js,jsx,py,rs,go,java,c,cpp,cs,rb,php,swift,kt}"
---

# Engineering Weight

## Code Generation Rules

- Follow established project patterns over personal preference
- Prefer smaller, focused files over large monoliths
- Files that change together should live together
- DRY (Don't Repeat Yourself), YAGNI (You Aren't Gonna Need It)
- Validate at system boundaries, not deep in business logic

## File Handling

- Read files before modifying — understand existing code first
- Prefer editing existing files over creating new ones
- Use relative paths within project
- Verify file existence before operations

## Testing

- Write regression tests for bug fixes
- Test behavior, not implementation details
- Verify with fresh test runs, not cached results
- Run full test suite after changes

## Error Handling

- Handle errors at appropriate abstraction level
- Don't swallow exceptions silently
- Log actionable information (not just "error occurred")
- Fail fast at boundaries, recover gracefully internally

## Dependencies

- Prefer standard library over third-party when adequate
- Pin dependency versions
- Audit new dependencies for security
- Keep dependency count minimal

## Commits

- Small, focused commits with clear messages
- Each commit should leave the project in a working state
- Separate refactoring commits from feature commits
