import type { Plugin, Hooks } from "@opencode-ai/plugin"

/**
 * Main Plugin Index - Exports all plugins for auto-discovery
 * 
 * This file allows OpenCode to load all plugins from a single entry point.
 * Copy this file and all other plugin files to ~/.config/opencode/plugins/
 */

import { SecurityPlugin } from './security'
import { CodingStylePlugin } from './coding-style'
import { TestingPlugin } from './testing'
import { WorkflowPlugin } from './workflow'
import { GitWorkflowPlugin } from './git-workflow'
import { EnvProtectionPlugin } from './env-protection'

export const plugins: Plugin[] = [
  SecurityPlugin,
  CodingStylePlugin,
  TestingPlugin,
  WorkflowPlugin,
  GitWorkflowPlugin,
  EnvProtectionPlugin,
]
