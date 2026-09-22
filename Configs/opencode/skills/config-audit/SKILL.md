---
name: config-audit
description: This skill should be used when the user wants to audit, optimize, or trim their OpenCode config files. It performs cross-file consistency checks, redundancy detection, contradiction analysis, quality scoring, and proposes consolidations across all config surfaces. Run periodically (e.g., monthly) to prevent config drift.Updated with instructions spread across multiple files. Aimed at improving support, accuracy and performance of locally hosted smaller (27B - 36BMoE) AI coding agents.
---

# Config Auditor

Audit, optimize, and trim OpenCode global configuration surfaces:
- **Global Config**: `~/.config/opencode/`
- **Config files**: Only `AGENTS.md`, `instructions/INSTRUCTIONS.md`, `instructions/LAWS.md`,`instructions/common/*.md`

Improve performance and accuracy in locally hosted LLMs used as AI coding agents in Opencode.
Minimize the instructions without losing scope.

## Writing Effective Instructions

When reviewing instructions:

- Prefer explicit constraints over explanations.
- State required behavior directly.
- Use short, imperative sentences.
- Express one requirement per bullet where practical.
- Remove examples unless they clarify ambiguous behavior.
- Remove rationale unless it affects execution.
- Avoid repeating the same instruction in different words.
- Keep related instructions grouped together.

## Workflow

### Phase 1: Read All Config Files

Read all config files and rules files in parallel:

```
opencode/AGENTS.md
opencode/instructions/INSTRUCTIONS.md
opencode/instructions/LAWS.md
opencode/instructions/common/*.md
```

Establish which concern each surface owns:

**Config files:**
- **AGENTS.md** - Identity, strategy, high-level workflow philosophy (the "who & why")
- **INSTRUCTIONS.md** - Operational playbook, detailed procedures, checklists (the "how")
- **LAWS.md** - Immutable constraints, boundaries, prohibitions (the "what")

**Common rules folder:**
- **instructions/common/*.md - Core rulesets for project management and development (security, testing, coding-style, git-workflow, etc.)

### Phase 2: Rules Internal Consistency

Scan the instructions/ folder for internal issues:

**2A. Common Internal Checks**
- Rules within `common/` that contradict each other
- Redundant rules across `common/*.md` files
- Rules that belong in a different common file (misplaced scope)

**Output**: Table of internal rules issues with file paths and recommendations.

### Phase 3: Cross-File Redundancy Check

Scan for instructions that appear in **more than one surface**:

| Redundancy Pattern | Example |
|---|---|
| Config ↔ Rules overlap | "No hardcoded secrets" in AGENTS.md AND instructions/common/security.md |
| TDD mandates | Test requirements in INSTRUCTIONS.md AND instructions/common/testing.md |
| Console.log prohibition | Same rule in INSTRUCTIONS checklist AND instructions/common/coding-style.md |
| Simplicity principle | Similar wording in AGENTS principles AND instructions/common/coding-style.md |
| Code review mandates | "Delegate to specialists" in LAWS AND instructions/common/code-review.md |
| Rules internal overlap | Same rule in instructions/common/security.md AND instructions/typescript/security.md |

**Output**: A table listing each redundant instruction, which files it appears in, and a consolidation recommendation.

### Phase 4: Contradiction Detection

Check for rules that **conflict** across any surface. Common signs:

- **Scope mismatch**: AGENTS says "no hardcoded values (all)" while instructions/common/security.md says "no hardcoded secrets (subset)" - ambiguity on which rule to follow
- **Conflicting priorities**: AGENTS says "be exhaustive" while INSTRUCTIONS says "3 searches max" - clarify which takes precedence
- **Contradictory workflows**: One file says "plan first" another says "just fix it" - flag for resolution
- **Rules vs Config conflicts**: A rule contradicts a constraint in LAWS.md

For each contradiction found, propose a resolution that eliminates the ambiguity.

### Phase 5: Quality Assessment

Score each file individually against these criteria (see `skills/config-audit/references/quality-criteria.md` for full rubric):

| Criterion | Weight | What to Check |
|---|---|---|
| Scoping | 25% | Does the file stick to its designated concern? No INSTRUCTIONS-level detail in AGENTS? |
| Actionability | 20% | Are instructions concrete and executable? Or vague and theoretical? |
| Conciseness | 20% | Every line adds value. No filler, no obvious info, no repetition. |
| Currency | 15% | Commands work, paths exist, tools referenced are still available. |
| Non-obvious value | 10% | Captures gotchas, edge cases, hard-won lessons - not generic advice. |
| Structure | 10% | Clear hierarchy, scannable sections, consistent formatting. |

**Output**: Scores with specific findings per file.

### Phase 6: Optimization Proposal

Synthesize Phases 2-5 into a concrete proposal:

1. **Consolidations** - Move instruction X from AGENTS to INSTRUCTIONS; merge duplicate rule Y into LAWS; deduplicate rules/ ↔ config overlap
2. **Trims** - Remove lines that are redundant, outdated, or obvious
3. **Clarifications** - Rewrite ambiguous rules with precise scope
4. **Additions** - Fill gaps identified by the assessment
5. **Re-assignments** - Move rules between common/ and language-specific folders where scope is wrong

Format each proposal as a diff block so the user can see exactly what changes.

### Phase 7: Apply With Approval

**Do NOT edit any file until the user approves the proposal.**

For each approved change:
1. Edit the target file
2. Verify the edit removed the redundancy or added the clarity intended
3. Confirm no new contradictions were introduced

---

## Layout Philosophy

The config files follow a **separation of concerns** architecture:

```
AGENTS.md          INSTRUCTIONS.md        LAWS.md
(Identity &        (Operational           (Constraints &
 Strategy)          Playbook)              Boundaries)

  Who we are         How to do it           What to never do
  Why we work        Detailed workflows     Immutable rules
  High-level flow    TDD cycles             Prohibitions
  Orchestration      Coding standards       Git/commit rules
                     Checklists             Privacy rules
```

The common/ folder contains general coding rules:

```
instructions/common/
(Cross-language
 core rulesets)

  code-review.md
  coding-style.md
  git-workflow.md
  hooks.md
  security.md
  testing.md
```

When auditing, ensure:
1. Each config file only contains content appropriate to its layer
2. `common/` rules are language-agnostic
3. Language-specific files extend (not replace) common rules
4. No rule appears in multiple surfaces without a clear reason

## References

- `skills/config-audit/references/quality-criteria.md` - Scoring rubric for Phase 5 assessment
