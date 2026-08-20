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
