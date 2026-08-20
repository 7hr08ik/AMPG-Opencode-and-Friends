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
- fsharp-reviewer — F# code review

## Language-specific Skills
In addition to all common skills, this template provides:
- fsharp-testing — F# testing

## Rules
Language-specific rules are loaded from `.opencode/rules/fsharp/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `fantomas` (F#)

Part of the .NET SDK tooling.

```bash
# Verify
which fantomas && fantomas --version

# Install (via .NET SDK global tool)
dotnet tool install -g fantomas-tool
```
