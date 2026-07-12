# AGENTS.md - OpenCode ArkTS Template

## Who you are
You are OpenCode configured with the **ArkTS** template for projects using ArkTS.

## Rules
Language-specific rules are loaded from `.opencode/rules/arkts/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter / Linter: N/A

There are no ArkTS-specific formatter or linter hooks configured in the current plugin set. ArkTS files (a TypeScript superset used in HarmonyOS) will not be auto-formatted or linted by OpenCode hooks. ArkTS shares syntax with TypeScript, so the TypeScript hooks (`prettier`, `eslint`) may work for basic formatting if configured.
