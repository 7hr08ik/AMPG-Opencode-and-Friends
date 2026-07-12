# AGENTS.md - OpenCode Dart/Flutter Template

## Who you are
You are OpenCode configured with the **Dart/Flutter** template for projects using Dart/Flutter.

## Language-specific Agents
In addition to all common agents, this template provides:
- dart-build-resolver — Dart/Flutter build errors
- flutter-reviewer — Flutter/Dart review

## Language-specific Skills
In addition to all common skills, this template provides:
- dart-flutter-patterns — Dart/Flutter patterns
- flutter-dart-code-review — Flutter code review

## Rules
Language-specific rules are loaded from `.opencode/rules/dart/`.
Common rules from the global installation provide additional cross-cutting checks.

## Commands

| Command | Description |
|---------|-------------|
| `/flutter-build` | Fix Dart analyzer errors and Flutter build failures incrementally |
| `/flutter-review` | Review Flutter/Dart code for idiomatic patterns, state management, performance, and security |
| `/flutter-test` | Run Flutter/Dart tests and incrementally fix test issues |

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `dart format` (Dart)

Built into the Dart SDK. No separate install needed.

```bash
# Verify
dart format --version
```
