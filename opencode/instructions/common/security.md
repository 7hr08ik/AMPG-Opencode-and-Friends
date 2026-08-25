# Security Instructions

These are mandatory security instructions. These rules must be followed.

## Mandatory Security Checks

Before ANY commit:
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on all endpoints
- [ ] Error messages don't leak sensitive data

## Secret Management

- NEVER hardcode secrets in source code.
- ALWAYS use environment variables or a secret manager.
- Validate that required secrets are present at startup.
- Rotate any secrets that may have been exposed and inform the user.

## Security Response Protocol

If security issue found:
1. STOP immediately
2. Use **security-reviewer** agent
3. Fix CRITICAL issues before continuing
4. Rotate any exposed secrets
5. Review entire codebase for similar issues

## Common Issues to Catch

### Security

- SQL injection (string concatenation in queries)
- XSS vulnerabilities (unescaped user input)
- Path traversal (unsanitized file paths)
- CSRF protection missing
- Authentication bypasses

### Code Quality

- Large functions (>60 lines) - split into smaller
- Deep nesting (>4 levels) - use early returns
- Missing error handling - handle explicitly
- Mutation patterns - prefer immutable operations
- Missing tests - add test coverage

# Security Hooks

## `tool.execute.before` Hooks

- **Secret Pattern Check**: Before writing any file, scan content for leaked secrets (AWS keys, GitHub tokens, private keys, connection strings with passwords). Block the write if detected. Triggers: all write operations
- **Input Validation Guard**: Before processing any user-provided input, verify it passes validation rules. Block tool execution if validation fails. Triggers: all tool executions involving user input
- **Error Leak Prevention**: Before returning errors to the user, strip stack traces, internal paths, and PII. Triggers: error outputs from any tool

## `tool.execute.after` Hooks

- **Secret Scan on Write**: After every file write, scan the new content for accidentally committed secrets. Log violations. Triggers: all write operations

## `session.idle` Hooks

- **Security Audit**: Before session ends, verify no secrets were written in this session. Block session close if violations found. Triggers: session end
