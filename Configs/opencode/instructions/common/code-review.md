# Code Review Standards

## Purpose

Code review ensures quality, security, and maintainability before code is merged. This rule defines when and how to conduct code reviews.

## When to Review

**MANDATORY review triggers:**

- After writing or modifying code
- Before any commit to shared branches
- When security-sensitive code is changed (auth, payments, user data)
- When architectural changes are made
- Before merging pull requests

**Pre-Review Requirements:**

Before requesting review, ensure:

- All automated checks (CI/CD) are passing
- Merge conflicts are resolved
- Branch is up to date with target branch

## Tools
**code-review** - Skill to be used whenever reviewing ANY code.
**/code-review** - Command used before processing any PR
**code-reviewer** - Agent for use during development


## Security Review Triggers

**STOP and use `security-reviewer` agent when:**

- Authentication or authorization code
- User input handling
- Database queries
- File system operations
- External API calls
- Cryptographic operations
- Payment or financial code

## Review Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| CRITICAL | Security vulnerability or data loss risk | **BLOCK** - Must fix before merge |
| HIGH | Bug or significant quality issue | **WARN** - Should fix before merge |
| MEDIUM | Maintainability concern | **INFO** - Consider fixing |
| LOW | Style or minor suggestion | **NOTE** - Optional |

## Review Workflow

1. Run git diff to understand changes
2. Check security checklist first
3. Review code quality checklist
4. Run relevant tests
5. Verify test coverage meets [Testing Requirements](testing.md)
6. Use appropriate agent for detailed review

## Common Issues to Catch

Security issues per [security.md](security.md); quality issues per [coding-style.md](coding-style.md).

### Performance

- N+1 queries, missing pagination/LIMIT, unbounded queries, missing caching.

## Approval Criteria

- **Approve**: No CRITICAL or HIGH issues
- **Warning**: Only HIGH issues (merge with caution)
- **Block**: CRITICAL issues found

## Integration with Other Rules

This rule works with:

- [testing.md](testing.md) - Test coverage requirements
- [security.md](security.md) - Security checklist
- [git-workflow.md](git-workflow.md) - Commit standards
