# Workflow Orchestration

## 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

## 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

## 3. Self-improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Ruthlessly iterate on lessons unless mistake rate drops
- Review lessons at start for relevant drops

## 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run checks, logs, demonstrate correctness

## 5. Demand Elegance (Balanced)
- For non-trivial tasks: pause and ask "is there a more elegant way?"
- If a fix is tacky: know everything i know now, implement the element solution
- Skip this for simple, obvious fixes -- don't over-engineer

## 6. Autonomous Bug Fixing
- When given a bug report: fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fixing it, tests without being told how

# Task Management
1. Plan: Write plan to tasks/todo.md with checklist items
2. Verify Plan: Check in verification steps in starting implementation
3. Track Progress: Mark items complete as you go
4. Explain Changes: High-level summary at each step
5. Document Results: Add review section to tasks/todo.md
6. Capture Lessons: Update tasks/lessons.md after corrections

# Core Principles
- Simplicity First: Make every change as simple as possible. Impact minimal code.
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.
- Minimal Impact: Only touch what's necessary. No side effects with new bugs.
