# Coding Style

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:

```
// Pseudocode
WRONG:  modify(original, field, value) → changes original in-place
CORRECT: update(original, field, value) → returns new copy with change
```

Rationale: Immutable data prevents hidden side effects, makes debugging easier, and enables safe concurrency.

## Core Principles

### NASA Coding Rules (The Power of Ten)

- **Loop Bounds**: All loops must have a fixed upper-bound that can be statically proven. Unbounded loops can cause runaway code and make verification impossible.
- **Bounded Memory**: Avoid unbounded heap growth. Set limits on data structures that grow during execution. Use bounded collections, streaming processing, or explicit cleanup for long-running operations.
- **Function Size**: No function should exceed 60 lines (one page). Each function should be a logical unit understandable and verifiable as a unit.
- **Assertion Density**: Minimum 2 assertions per function. Assertions should be side-effect free Boolean tests with recovery actions. Use assertions to verify pre-conditions, post-conditions, and invariants.
- **Variable Scope**: Declare variables at the smallest possible scope. Smaller scope makes code easier to reason about and less prone to corruption.
- **Return Value Checking**: Always check return values of non-void functions. Validate parameters inside each function. Ignored errors lead to silent failures and hard-to-debug issues.
- **Static Analysis**: Compile with all warnings enabled. Zero warnings policy. Run static analysis daily. Rewrite confusing code instead of suppressing warnings.

### StackOverflow Comment guildlines

Comment well, and often. Following these rules:

- Rule 1: Comments should not duplicate the code.
- Rule 2: Good comments do not excuse unclear code.
- Rule 3: If you can't write a clear comment, there may be a problem with the code.
- Rule 4: Comments should dispel confusion, not cause it.
- Rule 5: Explain unidiomatic code in comments.
- Rule 6: Provide links to the original source of copied code.
- Rule 7: Include links to external references where they will be most helpful.
- Rule 8: Add comments when fixing bugs.
- Rule 9: Use comments to mark incomplete implementations.

### KISS (Keep It Simple)

- Prefer the simplest solution that actually works
- Avoid premature optimization
- Optimize for clarity over cleverness

### DRY (Don't Repeat Yourself)

- Extract repeated logic into shared functions or utilities
- Avoid copy-paste implementation drift
- Introduce abstractions when repetition is real, not speculative

### YAGNI (You Aren't Gonna Need It)

- Do not build features or abstractions before they are needed
- Avoid speculative generality
- Start simple, then refactor when the pressure is real

## File Organization

MANY SMALL FILES > FEW LARGE FILES:
- High cohesion, low coupling
- Extract utilities from large modules
- Organize by feature/domain, not by type

## Error Handling

ALWAYS handle errors comprehensively:
- Handle errors explicitly at every level
- Provide user-friendly error messages in UI-facing code
- Log detailed error context on the server side
- Never silently swallow errors

## Input Validation

ALWAYS validate at system boundaries:
- Validate all user input before processing
- Use schema-based validation where available
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

## Naming Conventions

- Variables and functions: `camelCase` with descriptive names
- Booleans: prefer `is`, `has`, `should`, or `can` prefixes
- Interfaces, types, and components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Custom hooks: `camelCase` with a `use` prefix

## Code Smells to Avoid

- **Deep Nesting**: Prefer early returns over nested conditionals once the logic starts stacking.
- **Magic Numbers**: Use named constants for meaningful thresholds, delays, and limits.
- **Long Functions**: Split large functions into focused pieces with clear responsibilities.

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are small (<=60 lines)
- [ ] Files are focused
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No hardcoded secrets (use environment variables)
- [ ] No mutation (immutable patterns used)
- [ ] All loops have fixed upper-bound
- [ ] Functions have >=2 assertions
- [ ] Return values are checked
- [ ] Variables declared at smallest scope

---

# Coding Style Hooks

## `tool.execute.after` Hooks

- **Immutability Enforcer**: After every edit, detect in-place mutations (e.g., `modify(original, field, value)`, `changes original`, `in-place`). Log violations. Triggers: all edit operations
- **Nesting Depth Enforcer**: After every edit, detect code with >4 levels of nesting. Log warnings. Triggers: all edit operations
- **File Size Enforcer**: After every edit, detect files exceeding 800 lines. Log warnings. Triggers: all edit operations
- **Function Size Enforcer**: After every edit, detect functions exceeding 60 lines. Log warnings. Triggers: all edit operations
- **Loop Bounds Enforcer**: After every edit, detect loops without fixed upper-bound. Log warnings. Triggers: all edit operations
- **Bounded Memory Enforcer**: After every edit, detect unbounded data structure growth (e.g., arrays growing without limit). Log warnings. Triggers: all edit operations
- **Assertion Density Enforcer**: After every edit, detect functions with <2 assertions. Log warnings. Triggers: all edit operations
- **Variable Scope Enforcer**: After every edit, detect variables declared at function scope but used sparingly. Log warnings. Triggers: all edit operations

## `session.idle` Hooks

- **Code Quality Audit**: Before session ends, scan all modified files for code quality violations (immutability, nesting depth, file size). Log violations. Triggers: session end
