# Git Workflow

## Commit Style
- Use conventional commits.
- Keep changes modular and explain user-facing impact in the PR summary.

## Commit Message Format
```
<type>: <description>

<optional body>

Note: AI Generated Commit
```

Types: feat, fix, refactor, docs, test, chore, perf, ci, build, style

## Pull Request Workflow

When creating PRs:
1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

# Git Workflow Hooks

## `session.idle` Hooks

- **Commit Convention Check**: Before any commit, verify conventional commit format (`feat:`, `fix:`, `docs:`). Log warnings if format violated. Triggers: all git commit operations
- **Secret in Commit Scan**: Before any commit, scan staged files for secrets. Block commit if secrets detected. Triggers: all git commit operations
