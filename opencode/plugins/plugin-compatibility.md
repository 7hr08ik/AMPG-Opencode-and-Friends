# OpenCode Plugin Compatibility Guide

This document outlines the requirements and guidelines for ensuring compatibility between OpenCode templates and the OpenCode plugin system.

## Event Mapping Reference

When converting from Claude Code hook patterns to OpenCode plugins, use the following event mappings:

| Claude Hook | OpenCode Event | Description |
|-------------|----------------|-------------|
| `PreToolUse` | `tool.execute.before` | Run before tool execution, can block |
| `PostToolUse` | `tool.execute.after` | Run after tool execution |
| `UserPromptSubmit` | `message.*` events | Process user prompts |
| `SessionEnd` | `session.idle` | Session completion |

## Plugin Structure Requirements

OpenCode plugins must follow this structure:

```javascript
export const MyPlugin = async (context) => {
  // context: { project, client, $, directory, worktree }

  return {
    event: async ({ event }) => {
      switch(event.type) {
        case 'tool.execute.before':
          // Handle pre-tool execution
          break;
        case 'tool.execute.after':
          // Handle post-tool execution  
          break;
        case 'session.idle':
          // Handle session end
          break;
        default:
          // Handle other events
      }
    }
  };
};
```

## Best Practices

1. **Use proper event handling**: Switch on `event.type` to handle different events
2. **Async handlers**: All event handlers must be async functions
3. **Error handling**: Wrap logic in try/catch blocks to prevent plugin crashes
4. **Context awareness**: Use the provided context object for access to project, client, and utilities
5. **Return overrides**: For certain events, return override objects to modify behavior

## Template Compatibility

All templates must be updated to use OpenCode's event-driven hook system instead of Claude Code-style hooks.