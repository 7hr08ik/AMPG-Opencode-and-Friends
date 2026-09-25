# NASA "Power of Ten" Integration Proposal

**Source**: Gerard J. Holzmann, NASA/JPL Laboratory for Reliable Software  
**Document**: "The Power of Ten – Rules for Developing Safety Critical Code"

---

## 1. Executive Summary

This proposal maps 7 of the 10 NASA safety-critical coding rules to specific locations within the OpenCode template. Rules 1 (no recursion), 8 (preprocessor limits), and 9 (pointer restrictions) are excluded as they are personal preferences out of scope for this template project.

The implementation strategy uses a **hybrid approach**:

- **AGENTS.md** — Core principles and behavioral guidelines
- **instructions/common/*.md** — Detailed rules and checklists
- **plugins/** — Runtime enforcement via hooks
- **development-workflow.md** — Process-oriented rules

**Key Insight**: The NASA rules were designed for C safety-critical systems. We adapt them to be **language-agnostic** while preserving the safety philosophy, making them applicable to any programming language supported by OpenCode.

---

## 2. Rule-by-Rule Analysis

### 2.1. Rule 2: All Loops Must Have Fixed Upper-Bound

**What**: Loops must have statically provable iteration bounds.

**Current State**: 
- No enforcement
- AGENTS.md mentions "avoid infinite loops" implicitly

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `AGENTS.md` | Add: "All loops must have a fixed upper-bound" |
| `instructions/common/coding-style.md` | Add "Loop Bounds" section |
| `opencode/plugins/coding-style.ts` | Add `checkLoopBounds()` function |

**Implementation Details**:
```typescript
function checkLoopBounds(content: string): string[] {
  const violations: string[] = [];
  const loopPatterns = [
    /for\s*\(.*;.*;.*\)/g,
    /while\s*\(/g,
    /do\s*\{/g,
  ];
  
  for (const pattern of loopPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      // Check if loop has a clear bound (simplified)
      // In practice, this would need AST parsing for accuracy
      violations.push(`Loop detected: ensure fixed upper-bound`);
    }
  }
  
  return violations;
}
```

**Rationale**: Unbounded loops can cause runaway code and make verification impossible. Applies to all languages (C, C++, Java, Python, etc.).

---

### 2.2. Rule 3: No Dynamic Memory Allocation After Initialization

**What**: No malloc/free after init. Use stack or pre-allocated memory.

**Current State**: 
- Partially addressed by "Immutability" rule
- Memory management varies by language (manual in C/C++, GC in Java/Python/JS)

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `AGENTS.md` | Note: "Avoid unbounded heap growth; prefer pre-allocated structures where possible" |
| `instructions/common/coding-style.md` | Add "Memory Management" section (language-agnostic) |

**Implementation Details**:
```typescript
// Check for unbounded data structure growth (applies to all languages)
function checkUnboundedGrowth(content: string): string[] {
  const violations: string[] = [];
  
  // Patterns that indicate unbounded growth
  const patterns = [
    /array\.push\(/g,      // Could be unbounded
    /new\s+Array\(/g,      // Dynamic sizing
    /vector\.push_back\(/, // C++ unbounded growth
    /append\(/g,           // Go/Python unbounded growth
  ];
  
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 3) {
      violations.push(`Potential unbounded growth: ${pattern.source}`);
    }
  }
  
  return violations;
}
```

**Rationale**: While GC languages handle memory, unbounded growth can cause OOM and performance issues. For manual memory management (C/C++), this rule prevents leaks and fragmentation.

---

### 2.3. Rule 4: Functions ≤60 Lines (One Page)

**What**: No function longer than what fits on one page (≈60 lines).

**Current State**: 
- ✅ **Already implemented** in `coding-style.ts` with `funcsize = 50`
- AGENTS.md mentions "Functions are small (<50 lines)"

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `opencode/plugins/coding-style.ts` | Change `funcsize` from 50 to 60 to match NASA standard |
| `instructions/common/coding-style.md` | Update to "Functions are small (≤60 lines)" |

**Implementation Details**:
```typescript
// In coding-style.ts
const funcsize = 60;  // NASA standard: one page
```

**Rationale**: Direct mapping. The current 50-line limit is slightly stricter; 60 lines matches NASA exactly.

---

### 2.4. Rule 5: Minimum 2 Assertions Per Function

**What**: Each function should have ≥2 assertions (side-effect free Boolean tests with recovery).

**Current State**: 
- No enforcement
- Testing plugin exists but doesn't check assertion density

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `AGENTS.md` | Add: "Use assertions for pre/post-conditions and invariants" |
| `instructions/common/coding-style.md` | Add "Assertion Density" section |
| `opencode/plugins/coding-style.ts` | Add `checkAssertionDensity()` function |

**Implementation Details**:
```typescript
function checkAssertionDensity(content: string): string[] {
  const violations: string[] = [];
  const funcRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>))/g;
  
  let match;
  while ((match = funcRegex.exec(content)) !== null) {
    const funcName = match[1] || match[2];
    const startIdx = match.index;
    
    // Find function body (simplified)
    const braceStart = content.indexOf('{', startIdx);
    const braceEnd = findMatchingBrace(content, braceStart);
    const funcBody = content.substring(braceStart, braceEnd);
    
    // Count assertions (language-agnostic patterns)
    const assertPatterns = [/assert\(/, /c_assert\(/, /debug_assert\(/, /pytest\.assume\(/, /expect\(/];
    let assertCount = 0;
    for (const pattern of assertPatterns) {
      assertCount += (funcBody.match(pattern) || []).length;
    }
    
    if (assertCount < 2 && funcBody.trim().length > 100) {
      violations.push(`${funcName}: low assertion density (${assertCount} assertions, min 2)`);
    }
  }
  
  return violations;
}
```

**Rationale**: Assertions catch defects early and make code self-documenting. Applies to all languages (C, C++, Java, Python, Rust, etc.).

---

### 2.5. Rule 6: Data at Smallest Possible Scope

**What**: Declare variables at the smallest scope possible.

**Current State**: 
- Partially addressed by "Immutability" and "Nesting Depth" rules
- No explicit scope check

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `instructions/common/coding-style.md` | Add "Variable Scope" section |
| `opencode/plugins/coding-style.ts` | Add `checkVariableScope()` function |

**Implementation Details**:
```typescript
function checkVariableScope(content: string): string[] {
  const violations: string[] = [];
  
  // Check for variables declared at function scope but used in small scope
  const varDeclRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
  let match;
  
  while ((match = varDeclRegex.exec(content)) !== null) {
    const varName = match[1];
    const declLine = content.substring(0, match.index).split('\n').length;
    
    // Count usages after declaration
    const usagePattern = new RegExp(`\\b${varName}\\b`, 'g');
    const remaining = content.substring(match.index);
    const usages = remaining.match(usagePattern) || [];
    
    // If variable declared early but used only in small scope, flag it
    if (usages.length <= 2 && remaining.split('\n').length > 50) {
      violations.push(`Variable '${varName}' declared at line ${declLine} but used sparingly`);
    }
  }
  
  return violations;
}
```

**Rationale**: Smaller scope = easier to reason about and less prone to corruption. Applies to all languages with lexical scoping.

---

### 2.6. Rule 7: Check Return Values, Validate Parameters

**What**: Always check return values of non-void functions; validate parameters inside functions.

**Current State**: 
- AGENTS.md has "Security-First" and "Input Validation"
- No explicit return-value checking enforcement

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `AGENTS.md` | Add: "Always check return values; validate all parameters" |
| `instructions/common/coding-style.md` | Add "Return Value Checking" section |
| `opencode/plugins/linting.ts` | Add rule to check for ignored return values |

**Implementation Details**:
```typescript
// Check for ignored return values (language-agnostic patterns)
function checkIgnoredReturnValues(content: string): string[] {
  const violations: string[] = [];
  
  // Patterns that indicate ignored return values
  const patterns = [
    /if\s*\(\w+\(\).*\)\s*\{.*\}/,  // if (func()) { ... } without checking
    /\w+\([^)]*\)\s*;/,  // standalone function call (not assigned)
  ];
  
  for (const pattern of patterns) {
    const matches = content.match(pattern);
    if (matches) {
      // This is a simplified check; real implementation would need AST
      violations.push(`Potential ignored return value`);
    }
  }
  
  return violations;
}
```

**Rationale**: Ignored errors lead to silent failures and hard-to-debug issues. Applies to all languages (C, C++, Java, Python, Rust, Go, etc.).

---

### 2.7. Rule 10: Zero Warnings, Daily Static Analysis

**What**: Compile with all warnings enabled. Zero warnings. Daily static analysis.

**Current State**: 
- Partially addressed by "Testing + Verification" in AGENTS.md
- No automated static analysis enforcement

**Proposed Implementation**:
| Location | Content |
|----------|---------|
| `AGENTS.md` | Add: "Zero warnings policy; run static analysis daily" |
| `instructions/common/development-workflow.md` | Add "Static Analysis" section |
| `opencode/plugins/linting.ts` | Enhance to check for language-specific warnings |

**Implementation Details**:
```typescript
// In development-workflow.md
## 3. Static Analysis

- Run language-specific compiler with strict warnings before commits
- Use language-appropriate linter with strict ruleset
- Zero warnings allowed (rewrite confusing code, don't suppress)
- Run daily with appropriate tools:
  - TypeScript: `npx tsc --strict --noEmit && npx eslint src/`
  - Python: `pylint src/`
  - Rust: `cargo clippy`
  - Go: `go vet ./...`
  - C/C++: `cppcheck --enable=all src/`
```

**Rationale**: Warnings often indicate real bugs. Daily analysis catches issues early. Applies to all compiled and interpreted languages.

---

## 4. Implementation Priority

| Priority | Rule | Location | Effort |
|----------|------|----------|--------|
| **P0** | Rule 4 (Functions ≤60 lines) | Plugin + docs | 5 min |
| **P1** | Rule 2 (Loop bounds) | Plugin + AGENTS.md | 30 min |
| **P1** | Rule 10 (Zero warnings) | AGENTS.md + workflow | 15 min |
| **P2** | Rule 5 (Assertion density) | Plugin + docs | 45 min |
| **P2** | Rule 7 (Return values) | Linting plugin | 30 min |
| **P3** | Rule 6 (Variable scope) | Plugin + docs | 20 min |
| **P3** | Rule 3 (Memory growth) | Docs only | 10 min |

---

## 5. Proposed File Changes

### 5.1. `AGENTS.md` — Add NASA Rules Section

```markdown
#### 5.1.1. Safety-Critical Coding Rules (NASA Power of Ten)

For safety-critical code, follow these additional rules:

2. **Bounded loops** — All loops must have fixed upper-bound
3. **Bounded memory** — Avoid unbounded heap growth
4. **Small functions** — ≤60 lines (one page)
5. **Assertion density** — ≥2 assertions per function
6. **Small scope** — Declare variables at smallest scope
7. **Check returns** — Always check return values; validate parameters
10. **Zero warnings** — Compile strict; run static analysis daily
```

### 5.2. `instructions/common/coding-style.md` — Add NASA Sections

```markdown
#### 5.2.1. Loop Bounds
- All loops must have fixed upper-bound
- Statically provable iteration limits

#### 5.2.2. Function Size
- Maximum 60 lines (one page)
- One logical unit per function

#### 5.2.3. Assertion Density
- Minimum 2 assertions per function
- Side-effect free Boolean tests
- Recovery actions on failure

#### 5.2.4. Variable Scope
- Declare at smallest possible scope
- Avoid reusing variables for multiple purposes

#### 5.2.5. Return Value Checking
- Always check return values of non-void functions
- Validate parameters inside each function
- Cast to (void) only when response is ident##ical to success

#### 5.2.6. Static Analysis
- Compile with all warnings enabled
- Zero warnings policy
- Daily static analysis with state-of-the-art tools
```

### 5.3. `opencode/plugins/coding-style.ts` — Add New Checks

```typescript
// Add to checkFunctions or create new check functions (language-agnostic patterns):
- checkLoopBounds()
- checkAssertionDensity()
- checkVariableScope()

// Update funcsize from 50 to 60
const funcsize = 60;
```

### 5.4. `opencode/plugins/linting.ts` — Add Return Value Check

```typescript
// Add rule to detect ignored return values
function checkIgnoredReturnValues(content: string): string[]
```

### 5.5. `instructions/common/development-workflow.md` — Add Static Analysis

```markdown
#### 5.5.1. Static Analysis

- Run before every commit: `npx tsc --strict --noEmit`
- Run daily: `npx eslint src/ --max-warnings 0`
- Zero warnings policy
- Rewrite confusing code instead of suppressing warnings
```

---

## 6. Testing Strategy

Add tests to `opencode/plugins/__tests__/behavioral.test.ts`:

```typescript
describe("NASA Rule 2: Loop Bounds", () => {
  it("detects loops without fixed upper-bound", async () => {
    // Test that unbounded loops are flagged (applies to all languages)
  });
});

describe("NASA Rule 4: Function Size", () => {
  it("flags functions >60 lines", async () => {
    // Test with 61-line function
  });
});

describe("NASA Rule 5: Assertion Density", () => {
  it("flags functions with <2 assertions", async () => {
    // Test with function having 1 assertion
  });
});

describe("NASA Rule 7: Return Value Checking", () => {
  it("flags ignored return values", async () => {
    // Test with ignored function return
  });
});
```

---