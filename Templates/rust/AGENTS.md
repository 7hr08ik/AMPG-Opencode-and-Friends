# AGENTS.md



## Product/Feature Name
Project name: <name-me>


### Architecture
```
Project_Folder/
├── .opencode/              # Project level configs and extra files for opencode.
├── openspec/               # Config files for OpenSpec
├── Project_notes.txt       # User notes, etc
├── .env                    # Environment variables. Keys etc. -- Make sure its ignored where necessary
├── .gitignore              # The git ignore file
├── .ignore                 # For opencode-ignore plugin
├── AGENTS.md               # Basic template. Complete form, then run /init
└── opencode.jsonc          # Required for loading additional tools
```

---

## **Objective**

## **Success metrics**
| **Goal** | **Metric** |
| --- | --- |
|  |  |
|  |  |

## **Assumptions**

## **Milestones**

## **Requirements**
| **Requirement** | **User Story** | **Importance** | **Jira Issue** | **Notes** |
| --- | --- | --- | --- | --- |
|  |  | **HIGH** |  |  |
|  |  |  |  |  |

## **User interaction and design**

## **Open Questions**
| **Question** | **Answer** | **Date Answered** |
| --- | --- | --- |
|  |  |  |

## **Out of Scope**

- 

## **Reference materials**

---

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
