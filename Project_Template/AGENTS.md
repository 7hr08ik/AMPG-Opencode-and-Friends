# AGENTS.md

This is the project level AGENTS.md file.

Last Updated: 2026-10-02

Currently this file is in template form. The user must complete this form before running /init on any project. Delete this line, when running /init.

<!-- User inputs -- To be configured before running /init -->
## Product Details

- **Project name** <name-me>
- **Description:** <ONE-SENTENCE DESCRIPTION>
- **Stack(s):** <STACK> (one of: angular, cpp, csharp, dart, fsharp, golang, java, kotlin, perl, php, python, react, rust, swift, typescript, web, arkts, ruby)

## **Objective**

<objectify-me>

## Project Conventions

This project is opensource.
<ADD PROJECT-SPECIFIC CONVENTIONS HERE: module layout, commit scope, test commands, deploy target, anything an agent cannot infer from the stack rules.>

## Verification

<HOW TO VERIFY WORK HERE: test commands, lint commands, build commands. Be specific.>

## **Success metrics**
| **Goal** | **Metric** |
| --- | --- |
|  |  |
|  |  |
|  |  |

## **Assumptions**

## **Milestones**

## **Requirements**
| **Requirement** | **User Story** | **Importance** | **Jira Issue** | **Notes** |
| --- | --- | --- | --- | --- |
|  |  | **HIGH** |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

## **User interaction and design**

## **Open Questions**
| **Question** | **Answer** | **Date Answered** |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

## **Out of Scope**
<JUST TELL ME WHATS OOS - SO WE CAN IGNORE IT>

## **Reference materials**
<References>

---

<!-- AI Model only -- Instructional and reference data information -->
## Stack Rules (mandatory)

The global OpenCode config ships environment-specific rules at `~/.config/opencode/rules/<stack>/`. Each stack directory contains:

- `coding-style.md` - naming, structure, idioms
- `patterns.md` - proven patterns and anti-patterns
- `security.md` - stack-specific security rules
- `testing.md` - test framework and coverage expectations
- `hooks.md` - stack-specific automation hooks
- Extras where present (e.g. `python/fastapi.md`, `web/design-quality.md`, `web/performance.md`)

Before writing or modifying any code in this project:

1. Detect the stack from the Product Details above, or Stack Detection Markers below.
2. Read every `.md` file in `~/.config/opencode/rules/<stack>/`.
3. Follow the `paths:` frontmatter in each rule file - a rule applies only to files matching its paths.
4. Apply the stack rules alongside this file. On conflict, this file wins for project decisions; the global `~/.config/opencode/AGENTS.md` LAWS section still binds (it is immutable).

## Stack Detection

| Marker in project root | Stack | Rules dir |
|---|---|---|
| `requirements.txt`, `pyproject.toml`, `setup.py`, `*.py` | python | `~/.config/opencode/rules/python/` |
| `package.json`, `tsconfig.json`, `*.ts` | typescript | `~/.config/opencode/rules/typescript/` |
| `package.json` + React imports, `*.jsx` | react | `~/.config/opencode/rules/react/` |
| `go.mod`, `*.go` | golang | `~/.config/opencode/rules/golang/` |
| `Cargo.toml`, `*.rs` | rust | `~/.config/opencode/rules/rust/` |
| `*.cs`, `*.csproj` | csharp | `~/.config/opencode/rules/csharp/` |
| `*.java`, `pom.xml`, `build.gradle` | java | `~/.config/opencode/rules/java/` |
| `*.kt`, `*.kts` | kotlin | `~/.config/opencode/rules/kotlin/` |
| `*.swift`, `Package.swift` | swift | `~/.config/opencode/rules/swift/` |
| `*.rb`, `Gemfile` | ruby | `~/.config/opencode/rules/ruby/` |
| `*.php`, `composer.json` | php | `~/.config/opencode/rules/php/` |
| `*.pl`, `*.pm`, `cpanfile` | perl | `~/.config/opencode/rules/perl/` |
| `*.cpp`, `*.h`, `CMakeLists.txt` | cpp | `~/.config/opencode/rules/cpp/` |
| `*.dart`, `pubspec.yaml` | dart | `~/.config/opencode/rules/dart/` |
| `*.fs`, `*.fsx`, `*.fsproj` | fsharp | `~/.config/opencode/rules/fsharp/` |
| `*.ts` (Angular), `angular.json` | angular | `~/.config/opencode/rules/angular/` |
| `*.ets` (HarmonyOS) | arkts | `~/.config/opencode/rules/arkts/` |
| `*.html`, `*.css` (no framework) | web | `~/.config/opencode/rules/web/` |

If the project mixes stacks, read each applicable stack directory. Load only the stacks present - never load all of `rules/`.

---

## Folder Architecture
```
Project_Folder/
├── .opencode/              # Project level configs and extra files for opencode.
├── openspec/               # Config files for OpenSpec
├── Project_Notes.txt       # User notes, etc
├── .env                    # Environment variables. Keys etc. -- Make sure its ignored where necessary
├── .gitignore              # The git ignore file
├── AGENTS.md               # Basic template. Complete form, then run /init
└── opencode.jsonc          # Required for loading additional tools
```

---

## Required Tooling

