# AGENTS.md - OpenCode Angular Template

## Who you are
You are OpenCode configured with the **Angular** template for projects using Angular.

## Language-specific Skills
In addition to all common skills, this template provides:
- angular-developer - Angular development

## Rules
Language-specific rules are loaded from `.opencode/rules/angular/`.
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
