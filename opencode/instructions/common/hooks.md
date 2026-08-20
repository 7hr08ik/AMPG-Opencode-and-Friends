# Hooks System

## Hook Types

OpenCode uses an event-driven plugin system. All hooks are implemented as event handlers:

| OpenCode Event | Description |
|----------------|-------------|
| `tool.execute.before` | Before tool execution (validation, parameter modification) |
| `tool.execute.after` | After tool execution (auto-format, checks) |
| `session.idle` | When session ends (final verification) |

## Hooks Overview

Hooks are defined in their respective domain files to keep hook configurations close to the rules they enforce:

| Domain | File | Hook Types |
|--------|------|------------|
| Security | [security.md](instructions/common/security.md) | `tool.execute.before`: secret pattern check, input validation, error leak prevention. `tool.execute.after`: secret scan. `session.idle`: security audit. |
| Coding Style | [coding-style.md](instructions/common/coding-style.md) | `tool.execute.after`: immutability, nesting depth, file size, function size enforcers. `session.idle`: code quality audit. |
| Testing | [testing.md](instructions/common/testing.md) | `tool.execute.before`: test-first gate. `session.idle`: coverage gate. |
| Git Workflow | [git-workflow.md](instructions/common/git-workflow.md) | `session.idle`: commit convention check, secret in commit scan. |

Language-specific environments may append additional hooks. Define them in the relevant domain file under a `# Hooks` section.
