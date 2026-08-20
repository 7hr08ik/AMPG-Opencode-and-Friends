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
- php-reviewer — PHP code review

## Language-specific Skills
In addition to all common skills, this template provides:
- laravel-patterns — Laravel patterns
- laravel-security — Laravel security
- laravel-tdd — Laravel TDD
- laravel-verification — Laravel verification

## Rules
Language-specific rules are loaded from `.opencode/rules/php/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `pint` (PHP)

Laravel's opinionated PHP formatter.

```bash
# Verify
which pint && pint --version

# Install (via Composer, project-level or global)
composer global require laravel/pint
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```

### Linter: `phpstan` (PHP)

```bash
# Verify
which phpstan && phpstan --version

# Install (via Composer)
composer global require phpstan/phpstan
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```
