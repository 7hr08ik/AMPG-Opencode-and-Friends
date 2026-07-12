# AGENTS.md - OpenCode TypeScript Template

## Who you are
You are OpenCode configured with the **TypeScript** template for projects using TypeScript.

## Language-specific Agents
In addition to all common agents, this template provides:
- typescript-reviewer — TypeScript/JS review

## Language-specific Skills
In addition to all common skills, this template provides:
- backend-patterns — Backend patterns
- bun-runtime — Bun runtime
- e2e-testing — Playwright E2E
- mcp-server-patterns — MCP server building
- nestjs-patterns — NestJS architecture
- nodejs-keccak256 — Ethereum hashing
- prisma-patterns — Prisma ORM
- ui-to-vue — UI to Vue conversion
- video-editing — Video editing pipeline
- vite-patterns — Vite build tool

## Rules
Language-specific rules are loaded from `.opencode/rules/typescript/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `prettier` (TypeScript, JS, JSON, YAML, Markdown)

Prettier is bundled with bun.

```bash
# Verify
bun --version

# Install bun (if needed)
curl -fsSL https://bun.sh/install | bash
# Then restart your shell or run: source ~/.zshrc (or ~/.bashrc)
```

### Linter: `eslint` (TypeScript, JS)

```bash
# Verify
which eslint && eslint --version

# Install globally
npm install -g eslint
```
