# AGENTS.md - OpenCode PHP Template

## Who you are
You are OpenCode configured with the **PHP** template for projects using PHP.

## Language-specific Agents
In addition to all common agents, this template provides:
- php-reviewer — PHP code review

## Language-specific Skills
In addition to all common skills, this template provides:
- laravel-patterns — Laravel patterns
- laravel-security — Laravel security
- laravel-tdd — Laravel TDD
- laravel-verification — Laravel verification

## Rules
Language-specific rules are loaded from `.opencode/rules/php/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `pint` (PHP)

Laravel's opinionated PHP formatter.

```bash
# Verify
which pint && pint --version

# Install (via Composer, project-level or global)
composer global require laravel/pint
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```

### Linter: `phpstan` (PHP)

```bash
# Verify
which phpstan && phpstan --version

# Install (via Composer)
composer global require phpstan/phpstan
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```
