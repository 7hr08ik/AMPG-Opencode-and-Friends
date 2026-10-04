---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Hooks

## `tool.execute.before` Hooks

### File Size Guard (TS/JS Specific)

Block writes to `.ts`, `.tsx`, `.js`, `.jsx` files that exceed 800 lines. Single-file bloat accumulates technical debt - split large files into modules:

```json
{
  "hooks": {
    "tool.execute.before": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\\\n').length;if(lines>800){console.error('[Hook] BLOCKED: TS/JS file exceeds 800 lines ('+lines+' lines). Split into smaller modules.');process.exit(2)}console.log(d)})\"",
        "description": "Block TS/JS writes that exceed 800 lines"
      }
    ]
  }
}
```

### Credential Leak Prevention (TS/JS)

Before writing `.ts`/`.tsx`/`.js`/`.jsx` files, scan content for hardcoded credentials, API tokens, and secrets:

```json
{
  "hooks": {
    "tool.execute.before": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"const p=require('fs').readFileSync('/dev/stdin','utf8');const patterns=[{re:/AKIA[0-9A-Z]{16}/g,name:'AWS Key'},{re:/sk-[a-zA-Z0-9]{32,}/g,name:'Secret Key'},{re:/gh[pousr]_[a-zA-Z0-9]{36,}/g,name:'GitHub Token'},{re:/-----BEGIN.*PRIVATE KEY-----/g,name:'Private Key'},{re:/(password|pwd|secret)=[^\\\\.\\\\s]{8,}/gi,name:'Plaintext Credential'}];const m=patterns.flatMap(({re,name})=>(p.match(re)||[]).map(m=>({name,m})));if(m.length){console.error('[Hook] BLOCKED: '+m.length+' credential pattern(s) detected:',m.map(x=>x.name+' ('+x.m.substring(0,8)+'...)').join(', '));process.exit(2)}\"
      }
    ]
  }
}
```

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **Prettier**: Auto-format JS/TS files after edit (`prettier --write $FILE`)
- **TypeScript check**: Run `tsc --noEmit --incremental` after editing `.ts`/`.tsx` files
- **console.log warning**: Warn about `console.log` in edited files

## `session.idle` Hooks

- **console.log audit**: Check all modified files for `console.log` before session ends
