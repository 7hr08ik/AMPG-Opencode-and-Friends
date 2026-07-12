# Template Hook Migration Documentation

This document provides examples and guidance for migrating from Claude-style hook patterns to OpenCode plugin structure. These examples are designed for use in template documentation.

## Overview

OpenCode has evolved from the Claude Code hook system to a more powerful plugin-based architecture. This migration involves converting JSON hook definitions to JavaScript/TypeScript plugins using OpenCode's event-driven architecture.

## Migration Examples

### TypeScript Hooks Migration

**Before (Claude-style JSON hooks):**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\\\n').length;if(lines>800){console.error('[Hook] BLOCKED: TS/JS file exceeds 800 lines ('+lines+' lines). Split into smaller modules.');process.exit(2)}console.log(d)})\"",
        "description": "Block TS/JS writes that exceed 800 lines"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"const p=require('fs').readFileSync('/dev/stdin','utf8');const patterns=[{re:/AKIA[0-9A-Z]{16}/g,name:'AWS Key'},{re:/sk-[a-zA-Z0-9]{32,}/g,name:'Secret Key'},{re:/gh[pousr]_[a-zA-Z0-9]{36,}/g,name:'GitHub Token'},{re:/-----BEGIN.*PRIVATE KEY-----/g,name:'Private Key'},{re:/(password|pwd|secret)=[^\\\\.\\\\s]{8,}/gi,name:'Plaintext Credential'}];const m=patterns.flatMap(({re,name})=>(p.match(re)||[]).map(m=>({name,m})));if(m.length){console.error('[Hook] BLOCKED: '+m.length+' credential pattern(s) detected:',m.map(x=>x.name+' ('+x.m.substring(0,8)+'...)').join(', '));process.exit(2)}\"",
        "description": "Prevent credential leaks in TS/JS files"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "pnpm prettier --write \"$FILE_PATH\"",
        "description": "Format edited frontend files"
      }
    ]
  }
}
```

**After (OpenCode Plugin):**
```javascript
// .opencode/plugins/typescript-hooks.js

export const TypeScriptHooksPlugin = async ({ project, $ }) => {
  // File size validation logic
  const validateFileSize = async (filePath, content) => {
    const lines = content.split('\n').length;
    if (lines > 800) {
      throw new Error(`[Hook] BLOCKED: TS/JS file exceeds 800 lines (${lines} lines). Split into smaller modules.`);
    }
  };

  // Credential leak detection
  const detectCredentials = async (content) => {
    const patterns = [
      { re: /AKIA[0-9A-Z]{16}/g, name: 'AWS Key' },
      { re: /sk-[a-zA-Z0-9]{32,}/g, name: 'Secret Key' },
      { re: /gh[pousr]_[a-zA-Z0-9]{36,}/g, name: 'GitHub Token' },
      { re: /-----BEGIN.*PRIVATE KEY-----/g, name: 'Private Key' },
      { re: /(password|pwd|secret)=[^.\s]{8,}/gi, name: 'Plaintext Credential' }
    ];

    const matches = patterns.flatMap(({ re, name }) => {
      const found = content.match(re);
      return found ? found.map(match => ({ name, match })) : [];
    });

    if (matches.length > 0) {
      throw new Error(`[Hook] BLOCKED: ${matches.length} credential pattern(s) detected: ${matches.map(x => x.name + ' (' + x.match.substring(0, 8) + '...)').join(', ')}`);
    }
  };

  return {
    event: async ({ event }) => {
      switch (event.type) {
        case 'tool.execute.before': {
          const { tool, args } = event.data;
          
          // Handle file write operations
          if (tool === 'Write' || tool === 'Edit') {
            const filePath = args?.path || args?.filePath;
            const content = args?.content || '';
            
            // Validate file size for TypeScript/JavaScript files
            if (filePath && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
              await validateFileSize(filePath, content);
            }
            
            // Check for credentials in write operations
            if (tool === 'Write' && filePath && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
              await detectCredentials(content);
            }
          }
          break;
        }
        
        case 'tool.execute.after': {
          const { tool, success } = event.data;
          
          // Auto-format after edit operations
          if (tool === 'Edit' || tool === 'Write') {
            const filePath = args?.path || args?.filePath;
            if (filePath && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
              try {
                await $`pnpm prettier --write ${filePath}`;
              } catch (error) {
                console.error('Prettier formatting failed:', error.message);
              }
            }
          }
          break;
        }
      }
    }
  };
};
```

### Web Hooks Migration

**Before (Claude-style JSON hooks):**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "pnpm prettier --write \"$FILE_PATH\"",
        "description": "Format edited frontend files"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "pnpm eslint --fix \"$FILE_PATH\"",
        "description": "Run ESLint on edited frontend files"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "timeout 60 pnpm tsc --noEmit --pretty false --incremental --tsBuildInfoFile node_modules/.cache/tsc-hook.tsbuildinfo",
        "description": "Type-check after frontend edits (incremental + timeout-capped)"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\n').length;if(lines>800){console.error('[Hook] BLOCKED: File exceeds 800 lines ('+lines+' lines)');console.error('[Hook] Split into smaller modules');process.exit(2)}console.log(d)})\"",
        "description": "Block writes that exceed 800 lines"
      }
    ],
    "Stop": [
      {
        "command": "pnpm build",
        "description": "Verify the production build at session end"
      }
    ]
  }
}
```

**After (OpenCode Plugin):**
```javascript
// .opencode/plugins/web-hooks.js

export const WebHooksPlugin = async ({ project, $ }) => {
  // File size validation logic
  const validateFileSize = async (filePath, content) => {
    const lines = content.split('\n').length;
    if (lines > 800) {
      throw new Error(`[Hook] BLOCKED: File exceeds 800 lines (${lines} lines). Split into smaller modules.`);
    }
  };

  // Run linters and type-checkers
  const runFormatter = async (filePath) => {
    try {
      if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
        await $`pnpm prettier --write ${filePath}`;
      } else if (/\.(css|scss|sass)$/.test(filePath)) {
        await $`pnpm stylelint --fix ${filePath}`;
      }
    } catch (error) {
      console.error('Formatter failed:', error.message);
    }
  };

  const runLinters = async (filePath) => {
    try {
      if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
        await $`pnpm eslint --fix ${filePath}`;
      }
    } catch (error) {
      console.error('ESLint failed:', error.message);
    }
  };

  const runTypeCheck = async (filePath) => {
    try {
      // Run TypeScript check with timeout
      await $`timeout 60 pnpm tsc --noEmit --pretty false --incremental --tsBuildInfoFile node_modules/.cache/tsc-hook.tsbuildinfo`;
    } catch (error) {
      console.error('Type checking failed:', error.message);
    }
  };

  return {
    event: async ({ event }) => {
      switch (event.type) {
        case 'tool.execute.before': {
          const { tool, args } = event.data;
          
          // Handle file write operations
          if (tool === 'Write' || tool === 'Edit') {
            const filePath = args?.path || args?.filePath;
            const content = args?.content || '';
            
            // Validate file size for all files
            if (filePath && content) {
              await validateFileSize(filePath, content);
            }
          }
          break;
        }
        
        case 'tool.execute.after': {
          const { tool, success } = event.data;
          
          // Run formatters and linters after edit operations
          if (tool === 'Edit' || tool === 'Write') {
            const filePath = args?.path || args?.filePath;
            
            if (filePath) {
              // Format files
              await runFormatter(filePath);
              
              // Lint JavaScript/TypeScript files
              if (/\.(js|jsx|ts|tsx)$/.test(filePath)) {
                await runLinters(filePath);
                
                // Type check for TypeScript files
                if (/\.(ts|tsx)$/.test(filePath)) {
                  await runTypeCheck(filePath);
                }
              }
            }
          }
          break;
        }
        
        case 'session.idle': {
          // Final build verification at session end
          try {
            console.log('Running final build verification...');
            await $`pnpm build`;
          } catch (error) {
            console.error('Build verification failed:', error.message);
          }
          break;
        }
      }
    }
  };
};
```

## Migration Guidance

1. **Identify Hook Types**: Map Claude hook types to OpenCode events:
   - `PreToolUse` → `tool.execute.before`
   - `PostToolUse` → `tool.execute.after` 
   - `Stop` → `session.idle`

2. **Refactor Logic**: Convert command-line scripts to JavaScript/TypeScript functions

3. **Handle Events Properly**: Use the event-driven architecture with proper switch statements

4. **Error Handling**: Wrap logic in try/catch blocks and throw appropriate errors to block operations

5. **Context Usage**: Use the provided context for access to project, client, and utilities

6. **Testing**: Test plugins locally before installation using the mock testing approach shown in the plugin documentation

## Key Differences

| Claude Hook | OpenCode Plugin |
|-------------|-----------------|
| JSON-based configuration | JavaScript/TypeScript modules |
| Executable scripts | Functions with proper error handling |
| Limited event types | 32+ event types |
| Simple blocking | Rich return values for modification |
| Single command execution | Full async capabilities |

## Best Practices

1. **Use async functions** for all event handlers
2. **Implement proper error handling** to prevent plugin crashes
3. **Return override objects** when you need to modify behavior
4. **Destructure context properly** for access to utilities
5. **Test thoroughly** before deploying to production
6. **Follow the plugin structure** as shown in the documentation

This migration approach provides a more robust and maintainable solution compared to the old JSON hook configuration.