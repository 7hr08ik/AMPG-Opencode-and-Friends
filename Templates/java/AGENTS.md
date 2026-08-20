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

## Product/Feature Name
Project name: <name-me>


### Architecture
```
Project_Folder/
├── __The Project__ (Rename)                    #   Placeholder. The user will rename, and place their main project folder in here. This will be the working folder that contains the active project.
├── .opencode/                  # Project level configs and extra files for opencode.
├── Context/                    # Information pertinent to the current project.
│   ├── about-me.md                 # Simple files explaining me, and my requirements/style etc.
│   ├── the-customer.md                 # Details about the customer hiring you for the work.
│   └── the-user.md                 # Details about the intended userbase of the program/feature.
├── Project_Docs/                   # Mostly human centric files. User notes, etc
├── Scripted_Tools/                 # Just somewhere to keep any repeated scripts/tools used in the project
├── .env                    # Environment variables. Keys etc. -- Make sure its ignored where necessary
├── .gitignore                 # Preset
├── .ignore                 # Preset (for opencode-ignore plugin)
├── AGENTS.md                   # Default preset. Designed to be filled out, before running /init
├── TOOLS.md                    # Details of connected apps, sessions, outside programs.
└── opencode.jsonc                  # Basic opencode config files, required for loading additional tools
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
- java-reviewer — Java/Spring Boot review
- java-build-resolver — Java build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- java-coding-standards — Java coding standards
- jpa-patterns — JPA/Hibernate
- quarkus-patterns — Quarkus 3.x
- quarkus-security — Quarkus security
- quarkus-tdd — Quarkus TDD
- quarkus-verification — Quarkus verification
- springboot-patterns — Spring Boot
- springboot-security — Spring Security
- springboot-tdd — Spring Boot TDD
- springboot-verification — Spring Boot verification
- tinystruct-patterns — tinystruct framework

## Rules
Language-specific rules are loaded from `.opencode/rules/java/`.
Common rules from the global installation provide additional cross-cutting checks.

## Commands

| Command | Description |
|---------|-------------|
| `/gradle-build` | Fix Gradle build errors for Android and KMP projects |

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `google-java-format` (Java)

```bash
# Verify
which google-java-format && google-java-format --version

# Install (JAR-based, works on any OS with JDK)
mkdir -p ~/.local/bin
curl -Lo ~/.local/bin/google-java-format.jar \
  https://github.com/google/google-java-format/releases/download/v1.23.0/google-java-format-1.23.0-all-deps.jar
cat > ~/.local/bin/google-java-format << 'EOF'
#!/bin/bash
exec java -jar "$HOME/.local/bin/google-java-format.jar" "$@"
EOF
chmod +x ~/.local/bin/google-java-format
```

### Formatter: `prettier` (YAML, JSON, Markdown, TS/JS via bun)

Prettier is bundled with bun. Verify bun is available:

```bash
# Verify
bun --version

# Install bun (if needed)
curl -fsSL https://bun.sh/install | bash
# Then restart your shell or run: source ~/.zshrc (or ~/.bashrc)
```

### Linter: `checkstyle` (Java)

Checkstyle requires a config XML file. Download one and create a wrapper:

```bash
# Verify
which checkstyle

# Install (JAR-based)
mkdir -p ~/.local/bin
curl -Lo ~/.local/bin/checkstyle.jar \
  https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.21.1/checkstyle-10.21.1-all.jar
curl -Lo ~/.local/bin/checkstyle.xml \
  https://raw.githubusercontent.com/checkstyle/checkstyle/master/src/main/resources/google_checks.xml
cat > ~/.local/bin/checkstyle << 'EOF'
#!/bin/bash
exec java -jar "$HOME/.local/bin/checkstyle.jar" -c "$HOME/.local/bin/checkstyle.xml" "$@"
EOF
chmod +x ~/.local/bin/checkstyle
```

### PATH Configuration

Ensure `~/.local/bin` is in your PATH. Add to `~/.bashrc` or `~/.zshrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```
