# AGENTS.md - OpenCode C/C++ Template

## Who you are
You are OpenCode configured with the **C/C++** template for projects using C/C++.

## Language-specific Agents
In addition to all common agents, this template provides:
- cpp-reviewer — C++ code review
- cpp-build-resolver — C++ build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- cpp-coding-standards — C++ Core Guidelines
- cpp-testing — C++ testing

## Rules
Language-specific rules are loaded from `.opencode/rules/cpp/`.
Common rules from the global installation provide additional cross-cutting checks.

## Commands

| Command | Description |
|---------|-------------|
| `/cpp-build` | Fix C++ build errors, CMake issues, and linker problems incrementally |
| `/cpp-review` | Comprehensive C++ code review for memory safety, modern idioms, concurrency, and security |
| `/cpp-test` | Enforce TDD workflow for C++ with GoogleTest and coverage verification |

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `clang-format` (C, C++, Objective-C)

```bash
# Verify
which clang-format && clang-format --version

# Install (Linux)
sudo apt install clang-format
# or: sudo pacman -S clang

# Install (macOS)
brew install clang-format
```

### Linter: `clang-tidy` (C, C++)

```bash
# Verify
which clang-tidy && clang-tidy --version

# Install (Linux)
sudo apt install clang-tidy
# or: sudo pacman -S clang

# Install (macOS)
brew install clang
```
