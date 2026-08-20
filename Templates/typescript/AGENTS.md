# AGENTS.md



## Product/Feature Name
Project name: <name-me>


### Architecture
```
Project_Folder/
├── .opencode/              # Project level configs and extra files for opencode.
├── openspec/               # Config files for OpenSpec
├── Project_notes.txt       # User notes, etc
├── .env                    # Environment variables. Keys etc. -- Make sure its ignored where necessary
├── .gitignore              # The git ignore file
├── .ignore                 # For opencode-ignore plugin
├── AGENTS.md               # Basic template. Complete form, then run /init
└── opencode.jsonc          # Required for loading additional tools
```

---

## **Objective**

## **Success metrics**
| **Goal** | **Metric** |
| --- | --- |
|  |  |
|  |  |

## **Assumptions**

## **Milestones**

## **Requirements**
| **Requirement** | **User Story** | **Importance** | **Jira Issue** | **Notes** |
| --- | --- | --- | --- | --- |
|  |  | **HIGH** |  |  |
|  |  |  |  |  |

## **User interaction and design**

## **Open Questions**
| **Question** | **Answer** | **Date Answered** |
| --- | --- | --- |
|  |  |  |

## **Out of Scope**

- 

## **Reference materials**

---

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
