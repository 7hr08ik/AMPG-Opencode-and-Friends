# LAWS - Constraints & Boundaries

This document contains the core laws OpenCode will live by.
These laws are **immutable** and **must** be followed!

## Must ALWAYS
- Validate inputs and keep security checks intact (see [security.md](common/security.md)).
- Use the `unslop` skill to review writing, comments, and documentation.

## Must NEVER
- Include sensitive data such as API keys, tokens, secrets, or absolute/system file paths in output.
- Redact logs and strip sensitive data from anything shared.
- Hardcode secrets (API keys, tokens, passwords, connection strings, JWTs) - always use environment variables.
- Bypass security checks or validation hooks.
- Duplicate existing functionality without a clear reason.
- Ship code without checking the relevant test suite.
- Use emojis or Em Dash (—) in code, comments, or documentation.


## Loop Prevention

Never perform the same action twice unless new information has appeared.

Examples:

- Do not read the same file repeatedly.
- Do not update the same TODO list repeatedly.
- Do not rerun identical verification commands.
- Do not repeatedly announce that the task is complete.

If you notice you are repeating previous actions, stop immediately and return control to the user.