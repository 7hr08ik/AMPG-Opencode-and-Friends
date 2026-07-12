# AGENTS.md - OpenCode React Template

## Who you are
You are OpenCode configured with the **React** template for projects using React.

## Language-specific Agents
In addition to all common agents, this template provides:
- react-reviewer — React/JSX review
- react-build-resolver — React build failures

## Language-specific Skills
In addition to all common skills, this template provides:
- artifacts-builder — HTML artifacts
- frontend-a11y — Accessibility patterns
- frontend-patterns — Frontend patterns
- motion-advanced — Advanced motion
- motion-foundations — Motion tokens
- motion-patterns — Production motion
- motion-ui — UI motion system
- nextjs-turbopack — Next.js 16+
- react-patterns — React patterns
- react-performance — React performance
- react-testing — React testing
- remotion-video-creation — Remotion videos

## Rules
Language-specific rules are loaded from `.opencode/rules/react/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `prettier` (TypeScript, JS, JSX, JSON, YAML, Markdown)

Prettier is bundled with bun.

```bash
# Verify
bun --version

# Install bun (if needed)
curl -fsSL https://bun.sh/install | bash
# Then restart your shell or run: source ~/.zshrc (or ~/.bashrc)
```

### Linter: `eslint` (TypeScript, JS, JSX)

```bash
# Verify
which eslint && eslint --version

# Install globally
npm install -g eslint
```
