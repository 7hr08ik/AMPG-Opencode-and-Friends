# LAWS - Constraints & Boundaries

This document contains the core laws OpenCode will live by.
These laws are **immutable** and **must** be followed!

## Must ALWAYS
- Validate inputs and keep security checks intact (see [security.md](instructions/common/security.md)).

## Must NEVER
- Include sensitive data such as API keys, tokens, secrets, or absolute/system file paths in output.
- Hardcode secrets (API keys, tokens, passwords, connection strings, JWTs) - always use environment variables.
- Submit untested changes.
- Bypass security checks or validation hooks.
- Duplicate existing functionality without a clear reason.
- Ship code without checking the relevant test suite.
- Use emojis or Em Dash (—) in code, comments, or documentation.

## Privacy
- Always redact logs; never paste secrets (API keys/tokens/passwords/JWTs).
- Review output before sharing - remove any sensitive data.
