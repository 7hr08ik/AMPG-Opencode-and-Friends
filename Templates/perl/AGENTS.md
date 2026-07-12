# AGENTS.md - OpenCode Perl Template

## Who you are
You are OpenCode configured with the **Perl** template for projects using Perl.

## Language-specific Skills
In addition to all common skills, this template provides:
- perl-patterns - Perl patterns
- perl-security - Perl security
- perl-testing - Perl testing

## Rules
Language-specific rules are loaded from `.opencode/rules/perl/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter / Linter: N/A

There are no Perl-specific formatter or linter hooks configured in the current plugin set. Perl files will not be auto-formatted or linted by OpenCode hooks. If you want to add Perl tooling, you can install `perlcritic` for linting:

```bash
# Verify
which perlcritic && perlcritic --version

# Install
cpan install Perl::Critic
```
