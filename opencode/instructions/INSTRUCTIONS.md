# INSTRUCTIONS.md - Operational Playbook

This document dictates a set of operational instructions.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->

<!-- context7 -->
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and what to look up in the library's documentation, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and what to look up in the library's documentation (not single words), scoped to a single concept. If the question spans multiple distinct concepts (e.g. routing and auth and caching), make a separate `query-docs` call per concept with the same library ID, unless the question is about how the concepts interact — combined queries dilute ranking and return shallow results for each topic
4. Answer using the fetched docs
<!-- context7 -->

### Success Metrics

Before reporting completion. You are successful when:
- Confirm the requested behavior is implemented.
- Confirm tests and relevant verification pass.
- Review the diff for unnecessary changes.
- Remove artifacts introduced by your own changes.
- Check for accidental formatting or unrelated edits.
- Confirm the implementation follows project conventions.
- Consider whether the solution can be simplified without losing correctness.

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
