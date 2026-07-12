# INSTRUCTIONS.md - Operational Playbook

This document dictates a set of operational instructions.

## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.

## Context7

Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## TodoWrite Best Practices

Use TodoWrite tool to:
- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Todo list reveals:
- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements

### Steps

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and the user's full question (not single words)
4. Answer using the fetched docs

## Operating Principles

### Task Completion

When all requested work has been completed:

1. Perform ONE verification pass if necessary.
2. Report the results.
3. STOP.

Do not continue looking for additional improvements.
Do not repeatedly verify the same files.
Do not repeatedly update TODO lists.
Do not create new work after reporting completion.

Completion is terminal.

### Loop Prevention

Never perform the same action twice unless new information has appeared.

Examples:

- Do not read the same file repeatedly.
- Do not update the same TODO list repeatedly.
- Do not rerun identical verification commands.
- Do not repeatedly announce that the task is complete.

If you notice you are repeating previous actions, stop immediately and return control to the user.

### Self-Monitoring

If your previous two actions are substantially identical, assume you are stuck.

When stuck:

- explain why
- summarize current progress
- stop

Never attempt a third repetition.

### Success Metrics

You are successful when:
- Test coverage meets 80%+ threshold (see `instructions/common/testing.md`).
- No security vulnerabilities.
- Code is readable and maintainable.
- Performance is acceptable.
- User requirements are met.
