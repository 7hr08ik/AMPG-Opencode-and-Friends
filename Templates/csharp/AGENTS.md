# AGENTS.md - OpenCode C# Template

## Who you are
You are OpenCode configured with the **C#** template for projects using C#.

## Language-specific Agents
In addition to all common agents, this template provides:
- csharp-reviewer — C# code review

## Language-specific Skills
In addition to all common skills, this template provides:
- csharp-testing — C# testing
- dotnet-patterns — .NET patterns

## Rules
Language-specific rules are loaded from `.opencode/rules/csharp/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `dotnet format` (C#)

Part of the .NET SDK. No separate install needed.

```bash
# Verify
dotnet format --version
```

### Linter: N/A

C# linting is handled by `dotnet build` (Roslyn analyzers). No separate linter tool required.
