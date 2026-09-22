# Config File Quality Criteria

## Scoring Rubric (100 points)

### 1. Scoping - Sticks to designated concern (25 points)

**25 points**: File only contains content appropriate to its layer.
- AGENTS.md has no implementation detail or checklists
- INSTRUCTIONS.md has no strategic philosophy or immutable laws
- LAWS.md has no "how-to" instructions or strategy


**18 points**: Mostly clean, 1-2 items from wrong layer.

**10 points**: Multiple sections out of place, significant overlap with another file.

**5 points**: Large portions belong in a different file.

**0 points**: No clear separation - all concerns mixed across files.

### 2. Actionability - Instructions are executable (20 points)

**20 points**: Every instruction is concrete and precise.
- "Use conventional commits" not "Write good commit messages"
- Specific agent names, tool commands, file paths
- Steps can be followed without interpretation

**15 points**: Mostly actionable, 1-2 vague statements.

**10 points**: Several instructions require guessing intent.

**5 points**: Mostly theoretical guidance, few concrete steps.

**0 points**: All vague philosophy, no actionable content.

### 3. Conciseness - Every line adds value (20 points)

**20 points**: Dense signal, zero filler.
- No obvious statements ("code should be good quality")
- No duplication of what's already in another config file
- Each line teaches something non-obvious

**15 points**: Mostly tight, 1-2 padding lines.

**10 points**: Noticeable filler or obvious advice.

**5 points**: Verbose, several lines could be merged or removed.

**0 points**: Mostly redundant with other files or states the obvious.

### 4. Currency - Reflects current reality (15 points)

**15 points**: Everything accurate and current.
- Commands referenced still exist
- Tools/agents referenced are still available
- No references to deleted features

**10 points**: Minor staleness (wrong line counts, outdated agent names).

**5 points**: Several outdated references.

**0 points**: Severely outdated or references things that no longer exist.

### 5. Non-Obvious Value - Captures hard-won knowledge (10 points)

**10 points**: Contains gotchas, edge cases, lessons learned.
- "Watch out for X because Y"
- "This pattern failed before because..."
- Specific workarounds for known issues

**5 points**: Some valuable insights mixed with generic advice.

**0 points**: Only generic best practices found in any LLM prompt.

### 6. Structure - Clear hierarchy and scanability (10 points)

**10 points**: Well-organized, easy to scan.
- Consistent heading hierarchy
- Tables or lists for structured info
- Logical progression of topics

**5 points**: Acceptable structure, minor inconsistencies.

**0 points**: Walls of text, no clear organization.

## Grade Scale

| Score | Grade | Meaning |
|---|---|---|
| 90-100 | A | Excellent - clean, tight, actionable |
| 70-89 | B | Good - minor cleanup needed |
| 50-69 | C | Fair - significant trimming or restructuring needed |
| 25-49 | D | Poor - major overhaul needed |
| 0-24 | F | Critical - rewrite recommended |

## Red Flags During Audit

- Same instruction found in 2+ files → scoping failure
- A LAWS line that tells you *how* to do something (vs. *what* to never do)
- An AGENTS section that reads like a checklist or tutorial
- An INSTRUCTIONS section that declares an immutable prohibition (belongs in LAWS)

- Length > 80 lines for LAWS.md (should be the shortest file)
- Length > 250 lines for INSTRUCTIONS.md (may have drifted into reference territory)
- AGENTS.md exceeding 100 lines (likely includes operational detail)
