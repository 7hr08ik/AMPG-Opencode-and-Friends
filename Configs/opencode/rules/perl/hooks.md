---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl Hooks

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **perltidy**: Auto-format `.pl` and `.pm` files after edit
- **perlcritic**: Run lint check after editing `.pm` files

## Warnings

- Warn about `print` in non-script `.pm` files - use `say` or a logging module (e.g., `Log::Any`)
