# AGENTS.md - OpenCode Rust Template

## Who you are
You are OpenCode configured with the **Rust** template for projects using Rust.

## Language-specific Agents
In addition to all common agents, this template provides:
- rust-reviewer — Rust code review
- rust-build-resolver — Rust build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- rust-patterns — Rust patterns
- rust-testing — Rust testing

## Rules
Language-specific rules are loaded from `.opencode/rules/rust/`.
Common rules from the global installation provide additional cross-cutting checks.

## Commands

| Command | Description |
|---------|-------------|
| `/rust-build` | Fix Rust build errors, borrow checker issues, and dependency problems incrementally |
| `/rust-review` | Comprehensive Rust code review for ownership, lifetimes, error handling, and idiomatic patterns |
| `/rust-test` | Enforce TDD workflow for Rust with coverage verification |

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `cargo fmt` (Rust)

Built into cargo (Rust toolchain). No separate install needed.

```bash
# Verify
cargo fmt --version
```

### Linter: `cargo clippy` (Rust)

Built into cargo (Rust toolchain). No separate install needed.

```bash
# Verify
cargo clippy --version
```
