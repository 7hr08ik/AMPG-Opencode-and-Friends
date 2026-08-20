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

### Formatter / Linter: N/A

There are no ArkTS-specific formatter or linter hooks configured in the current plugin set. ArkTS files (a TypeScript superset used in HarmonyOS) will not be auto-formatted or linted by OpenCode hooks. ArkTS shares syntax with TypeScript, so the TypeScript hooks (`prettier`, `eslint`) may work for basic formatting if configured.
