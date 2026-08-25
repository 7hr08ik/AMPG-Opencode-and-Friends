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

## `tool.execute.before` Hooks

- **Commit Convention Check**: Before bash `git commit`, verify conventional format (`feat:`, `fix:`, `docs:`). Warn if violated. Triggers: git commit commands
- **Secret in Commit Scan**: Before bash `git commit`, scan staged changes for secrets. Block commit if detected. Triggers: git commit commands
