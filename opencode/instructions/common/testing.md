# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (framework chosen per language)

## TDD Workflow - (Test-Driven Development)

MANDATORY workflow:
1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Troubleshooting Test Failures

1. Use **tdd-guide** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)

# Testing Hooks

## `tool.execute.before` Hooks

- **Test-First Gate**: Before implementing any feature, verify a corresponding test exists or is being written. Block implementation if test is missing. Triggers: all implementation tool calls

Prefer Arrange-Act-Assert structure for tests. 

Use descriptive names that explain the behavior under test.

## `session.idle` Hooks

- **Coverage Gate**: Before session ends, verify test coverage is 80%+ for modified code. Log warnings if below threshold. Triggers: session end
