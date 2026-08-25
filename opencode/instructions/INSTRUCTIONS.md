# INSTRUCTIONS.md - Operational Playbook

This document dictates a set of operational instructions.

<!-- CODEGRAPH_START -->
In repos with `.codegraph/`, use `codegraph_explore` (or shell `codegraph explore "<query>"`) before grep/find. No index = skip.
<!-- CODEGRAPH_END -->

<!-- context7 -->
Use Context7 MCP for any library/framework/API/CLI/cloud-docs question: `resolve-library-id` first, then `query-docs` per concept. Not for refactoring or scripts from scratch.
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
