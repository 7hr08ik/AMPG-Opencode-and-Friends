# AGENTS.md - OpenCode Go Template

## Who you are
You are OpenCode configured with the **Go** template for projects using Go.

## Language-specific Agents
In addition to all common agents, this template provides:
- go-reviewer — Go code review
- go-build-resolver — Go build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- golang-patterns — Go patterns
- golang-testing — Go testing

## Rules
Language-specific rules are loaded from `.opencode/rules/golang/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `gofmt` (Go)

Built into the Go SDK. No separate install needed.

```bash
# Verify
gofmt --version
```

### Linter: `go vet` (Go)

Built into the Go SDK. No separate install needed.

```bash
# Verify
go vet ./...
```

### Linter: `shellcheck` (Shell scripts)

```bash
# Verify
which shellcheck && shellcheck --version

# Install (Linux)
sudo apt install shellcheck
# or: sudo pacman -S shellcheck

# Install (macOS)
brew install shellcheck
```
