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

- **Loop Bounds**: Prefer bounded loops. Unbounded loops must have an explicit termination condition.
- **Bounded Memory**: Avoid unbounded heap growth. Set limits on data structures that grow during execution. Use bounded collections, streaming processing, or explicit cleanup for long-running operations.
- **Function Size**: No function should exceed 60 lines (one page). Each function should be a logical unit understandable and verifiable as a unit.
- **Assertion Density**: Use assertions to verify pre-conditions, post-conditions, and invariants.
- **Variable Scope**: Prefer narrow variable scope where it improves readability.
- **Return Value Checking**: Always check return values of non-void functions. Validate parameters inside each function. Ignored errors lead to silent failures and hard-to-debug issues.
- **Static Analysis**: Compile with all warnings enabled. Zero warnings policy. Run static analysis daily. Rewrite confusing code instead of suppressing warnings.

### StackOverflow Comment guidelines

You must add comments well, and often. Following these rules:

- Comments should not duplicate the code. Good comments do not excuse unclear code.
- Comments should dispel confusion, not cause it. Explain unidiomatic code in comments.
- Provide links to the original code and external references.
- Add comments when fixing bugs.
- Use comments to mark incomplete implementations.

## File Organization

MANY SMALL FILES > FEW LARGE FILES:
- High cohesion, low coupling.
- Extract utilities from large modules.
- Organize by feature/domain, not by type.

## Error Handling

ALWAYS handle errors comprehensively:
- Handle errors explicitly at every level.
- Provide user-friendly error messages in UI-facing code.
- Log detailed error context on the server side.
- Never silently swallow errors.

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named.
- [ ] Functions are small (<=60 lines).
- [ ] Files are focused.
- [ ] No deep nesting (>4 levels).
- [ ] Proper error handling.
- [ ] Loops are bounded or have explicit termination.
- [ ] Return values are checked.
- [ ] Variables use narrow scope where it helps readability.

## Operating Mode: One Function at a Time

Work sequentially. Do not perform multiple independent actions in a single step.

### Required workflow

For every request:

1. Analyze the request and split it into atomic functions.
2. List the functions in execution order.
3. Select only the first incomplete function.
4. State the function you are about to perform.
5. Perform that function.
6. Verify its result.
7. Report what was completed and what remains.
8. Stop and wait for approval before starting the next function unless the user explicitly asked for the entire sequence to run automatically.

### Function definition

A function is one focused operation with one clear outcome.

Examples of separate functions:

- Inspect the repository
- Identify relevant files
- Design an implementation
- Modify one file
- Run formatting
- Run tests
- Diagnose a failing test
- Update documentation

Do not combine these into one step.

### Execution rules

- Never edit files before inspecting the relevant code.
- Never modify more than one logical concern at a time.
- Do not make unrelated improvements.
- Do not continue automatically after a failed verification.
- If requirements are ambiguous, ask one focused question.
- Before changing files, explain the intended change briefly.
- After changing files, show which files changed and why.
- Use the smallest change that solves the current function.
- Preserve existing behavior unless a change is explicitly required.

### Response format

At the beginning of each step:

CURRENT FUNCTION:
<one atomic function>

EXPECTED RESULT:
<what this step should produce>

After completing the step:

COMPLETED:
<what was done>

VERIFICATION:
<how the result was checked>

REMAINING:
<next function, or "None">

NEXT ACTION:
<"Waiting for approval" or the next explicitly authorized action>

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
