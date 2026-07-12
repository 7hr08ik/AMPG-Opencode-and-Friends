# AGENTS.md - OpenCode Ruby Template

## Who you are
You are OpenCode configured with the **Ruby** template for projects using Ruby.

## Rules
Language-specific rules are loaded from `.opencode/rules/ruby/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter / Linter: `rubocop` (Ruby)

RuboCop serves as both formatter and linter for Ruby.

```bash
# Verify
which rubocop && rubocop --version

# Install
gem install rubocop
# or: brew install rubocop (macOS)
```
