# Domain Docs

## Layout: single-context

This repo uses a single-context layout:

- `CONTEXT.md` at the repo root - the single source of truth for domain context
- `docs/adr/` directory at the repo root - Architecture Decision Records

**Consumers** (skills that read domain docs):
- `to-spec`: publishes the current spec to the issue tracker
- `to-tickets`: creates/updates tickets based on domain state
- `triage` (when installed): triages issues based on domain knowledge
- `codebase-onboarding`: onboards new contributors using the context

**Usage:**
- Keep `CONTEXT.md` updated with current project state
- Add new ADRs to `docs/adr/` as markdown files
- Reference `CONTEXT.md` when starting new work or making architectural decisions