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
- python-reviewer — Python code review
- django-reviewer — Django code review
- django-build-resolver — Django build/migration errors
- fastapi-reviewer — FastAPI review
- pytorch-build-resolver — PyTorch training errors

## Language-specific Skills
In addition to all common skills, this template provides:
- django-celery — Django + Celery async tasks
- django-patterns — Django architecture
- django-security — Django security
- django-tdd — Django TDD/writing
- django-verification — Django verification loop
- fastapi-patterns — FastAPI best practices
- image-enhancer — Image quality improvement
- llm-trading-agent-security — Trading agent security
- manim-video — Animated explainers
- mle-workflow — ML engineering
- netmiko-ssh-automation — Network SSH automation
- network-config-validation — Config validation
- python-patterns — Python idioms
- python-testing — Python testing
- pytorch-patterns — PyTorch deep learning
- video-downloader — Video downloading
- videodb — Video processing
- visa-doc-translate — Visa doc translation
- webapp-testing — Web app testing
- windows-desktop-e2e — Windows desktop E2E
- data-scraper-agent — Data collection agent
- gget — Genomic database queries

## Rules
Language-specific rules are loaded from `.opencode/rules/python/`.
Common rules from the global installation provide additional cross-cutting checks.

## Commands

| Command | Description |
|---------|-------------|
| `/python-review` | Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms |
| `/fastapi-review` | Review a FastAPI application for architecture, async correctness, dependency injection, and security |

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `black` (Python)

```bash
# Verify
which black && black --version

# Install
pip install black
# or: pipx install black
```

### Linter: `ruff` (Python)

```bash
# Verify
which ruff && ruff --version

# Install
pip install ruff
# or: pipx install ruff
# or (Linux/macOS): curl -sSf https://sh.ruff.dev | sh
```
