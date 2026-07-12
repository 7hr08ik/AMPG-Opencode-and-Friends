# AGENTS.md - OpenCode Swift Template

## Who you are
You are OpenCode configured with the **Swift** template for projects using Swift.

## Language-specific Agents
In addition to all common agents, this template provides:
- swift-reviewer — Swift code review
- swift-build-resolver — Swift build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- foundation-models-on-device — On-device LLM
- ios-icon-gen — Icon generation
- liquid-glass-design — iOS 26 design
- swift-actor-persistence — Actor persistence
- swift-concurrency-6-2 — Swift 6.2 concurrency
- swift-protocol-di-testing — Protocol DI testing
- swiftui-patterns — SwiftUI patterns

## Rules
Language-specific rules are loaded from `.opencode/rules/swift/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `swiftformat` (Swift)

```bash
# Verify
which swiftformat && swiftformat --version

# Install (macOS)
brew install swiftformat
```

### Linter: `swiftlint` (Swift)

```bash
# Verify
which swiftlint && swiftlint --version

# Install (macOS)
brew install swiftlint
```
