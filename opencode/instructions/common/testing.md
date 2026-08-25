# Testing Requirements

Question yourself: "Would a staff engineer approve this?".
Never mark a task complete without proving it works.

## Minimum Test Coverage: 80%

Test Types (ALL required):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (framework chosen per language)

## TDD Workflow - (Test-Driven Development)

MANDATORY workflow:
1. Reproduce the problem directly. Write test first (RED).
2. Run test - it should FAIL.
3. Write minimal implementation (GREEN).
4. Run the regression test - it should PASS.
5. Run relevant existing tests. Refactor (IMPROVE).
6. Verify coverage (80%+).

Prefer Arrange-Act-Assert structure. Use descriptive names that explain the behavior under test.

Inspect failures and resolve them rather than stopping at the first error.
Do not require hand-holding for clearly scoped bug fixes.

For multi-step bug fixes requiring architectural changes:
- Reproduce and understand the failure.
- Identify the architectural implications.
- Present a brief plan and relevant tradeoffs.
- Wait for approval before making the architectural change.
- Implement and verify the approved approach.

If CI tests fail for reasons caused by your changes, investigate and fix them without requiring the user to provide step-by-step instructions.

## Troubleshooting Test Failures

1. Use **tdd** skill
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

# Testing Hooks

## `tool.execute.before` Hooks

- **Test-First Gate**: Before implementing any feature, verify a corresponding test exists or is being written. Block implementation if test is missing. Triggers: all implementation tool calls

## `session.idle` Hooks

- **Coverage Gate**: Before session ends, verify test coverage is 80%+ for modified code. Log warnings if below threshold. Triggers: session end
