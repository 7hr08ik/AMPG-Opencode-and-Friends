# Installing Custom OpenCode Plugins

This guide explains how to install the custom plugins created for this project.

## Prerequisites

- OpenCode installed and working
- Node.js 18+ available
- Access to ~/.config/opencode/plugins/

## Plugin Files

The following plugin files have been created:

| Plugin | File | Purpose |
|--------|------|---------|
| Security | `security.ts` | Secret scanning, input validation, dangerous command blocking |
| Coding Style | `coding-style.ts` | Immutability, file size, nesting depth, function size checks |
| Testing | `testing.ts` | Test-first gate, coverage reminders |
| Workflow | `workflow.ts` | Search budget, re-read prevention, escalation checks |
| Git Workflow | `git-workflow.ts` | Conventional commits, secret scanning in commits |
| Formatting | `formatting.ts` | Auto-format files on save (Prettier, Black, gofmt, etc.) |
| Linting | `linting.ts` | Run linters on save (ESLint, Ruff, Clippy, etc.) |

## Installation Steps

### 1. Copy Plugin Files

```bash
# Copy all plugin files to OpenCode plugins directory
cp /home/rob/Projects/OpenCode\ Installation/opencode/plugins/*.ts ~/.config/opencode/plugins/

# Verify files are copied
ls -la ~/.config/opencode/plugins/
```

### 2. Verify Plugin Loading

Start OpenCode and check for plugin loading messages:

```bash
opencode
```

You should see messages like:
```
[Security] Plugin loaded
[Coding Style] Plugin loaded
[Testing] Plugin loaded
...
```

### 3. Test Plugins

Try these commands to verify plugins are working:

```bash
# Test security plugin - should block dangerous commands
# In OpenCode, try: bash rm -rf /

# Test coding style plugin - should warn about large files
# Edit a file with >800 lines

# Test formatting plugin - should auto-format on save
# Edit a .ts or .py file
```

## Plugin Behaviors

### Security Plugin
- **Blocks** writes containing secret patterns (AWS keys, GitHub tokens, etc.)
- **Blocks** dangerous bash commands (rm -rf /, shutdown, etc.)
- **Logs** secrets found during session at session end

### Coding Style Plugin
- **Warns** about files exceeding 800 lines
- **Warns** about mutation patterns (Array.push, Object.assign, etc.)
- **Warns** about nesting depth >4 levels
- **Warns** about functions >50 lines

### Testing Plugin
- **Warns** when implementing without writing tests first
- **Reminds** to run tests with coverage before session end

### Workflow Plugin
- **Blocks** after 3+ search operations (encourages ContextScout use)
- **Warns** when re-reading files
- **Suggests** escalation after failed searches

### Git Workflow Plugin
- **Blocks** commits not following conventional commit format
- **Blocks** commits containing secret patterns

### Formatting Plugin
- **Auto-formats** files on save based on file type
- Supports: Prettier, Black, gofmt, cargo fmt, clang-format, and more

### Linting Plugin
- **Runs linter** on save based on file type
- Supports: ESLint, Ruff, Clippy, ShellCheck, and more

## Troubleshooting

### Plugins Not Loading

1. Check file permissions:
   ```bash
   ls -la ~/.config/opencode/plugins/*.ts
   ```

2. Check for TypeScript errors:
   ```bash
   cd ~/.config/opencode/plugins
   npx tsc --noEmit *.ts
   ```

3. Check OpenCode logs for errors

### Plugin Conflicts

If plugins conflict with existing behavior:
1. Disable specific plugins by renaming files (e.g., `security.ts` -> `security.ts.disabled`)
2. Or modify the plugin code to adjust behavior

### Performance Issues

Plugins run on every tool execution. If you experience slowdowns:
1. Check plugin code for expensive operations
2. Ensure async operations don't block
3. Consider reducing plugin scope (e.g., only run linter on specific file types)

## Customization

### Modifying Plugin Behavior

Edit the plugin files in `~/.config/opencode/plugins/`:

```typescript
// Example: Disable secret scanning for specific patterns
const SECRET_PATTERNS = [
  // Remove patterns you don't want to block
];
```

### Adding New Plugins

1. Create a new `.ts` file in `~/.config/opencode/plugins/`
2. Follow the structure in `plugin-compatibility.md`
3. Export a Plugin function that handles events

### Disabling Plugins

Rename the plugin file:
```bash
mv ~/.config/opencode/plugins/security.ts ~/.config/opencode/plugins/security.ts.disabled
```

## Event Reference

| Event | When | Use Cases |
|-------|------|-----------|
| `tool.execute.before` | Before tool runs | Validation, blocking, parameter modification |
| `tool.execute.after` | After tool runs | Post-processing, logging, auto-formatting |
| `session.idle` | Session ends | Cleanup, audits, final checks |

## Further Reading

- `opencode/plugins/plugin-compatibility.md` - Event system documentation
- `opencode/skills/plugin-maker/SKILL.md` - Plugin development guide
- `~/.config/opencode/plugins/env-protection.ts` - Working plugin example
