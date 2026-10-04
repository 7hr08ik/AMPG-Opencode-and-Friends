---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.service.ts"
  - "**/*.directive.ts"
  - "**/*.pipe.ts"
  - "**/*.spec.ts"
---
# Angular Hooks

## `tool.execute.before` Hooks

### File Size Guard

Block writes to `.ts` and `.component.ts` files that exceed 800 lines - Angular components, services, and modules should be kept focused and modular:

```json
{
  "hooks": {
    "tool.execute.before": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.component.ts", "**/*.service.ts", "**/*.ts"],
        "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\\\n').length;if(lines>800){console.error('[Hook] BLOCKED: Angular file exceeds 800 lines ('+lines+' lines). Split into smaller modules/services.');process.exit(2)}console.log(d)})\"",
        "description": "Block Angular TS writes that exceed 800 lines"
      }
    ]
  }
}
```

### Credential Leak Prevention

Before writing Angular `.ts` files, scan for hardcoded credentials and API tokens (see `common/hooks.md` for pattern details).

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **Prettier**: Auto-format `.ts` and `.html` files after edit
- **ESLint / ng lint**: Run `ng lint` after editing Angular source files to catch decorator misuse, template errors, and style violations
- **TypeScript check**: Run `tsc --noEmit` after editing `.ts` files
- **Build check**: Run `ng build` after generating or significantly changing Angular code to catch template and type errors early

## `session.idle` Hooks

- **Lint audit**: Run `ng lint` across modified files before session ends to catch any outstanding violations
