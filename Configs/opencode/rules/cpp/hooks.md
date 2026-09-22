---
paths:
  - "**/*.cpp"
  - "**/*.hpp"
  - "**/*.cc"
  - "**/*.hh"
  - "**/*.cxx"
  - "**/*.h"
  - "**/CMakeLists.txt"
---
# C++ Hooks

> This file extends [common/hooks.md](../common/hooks.md) with C++ specific content.

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **clang-format**: Auto-format `.cpp` and `.hpp` files after edit (`clang-format -i --style=file $FILE`)
- **clang-tidy**: Run static analysis after editing `.cpp` files (`clang-tidy $FILE -- -std=c++17`)
- **cmake build**: Verify compilation after changes (`cmake --build build`)

## `tool.execute.before` Hooks

- **Header guard check**: Warn when new `.hpp`/`.h` files are written without `#pragma once` or header guards

## `session.idle` Hooks

- **Full build**: Run `cmake --build build && ctest --test-dir build --output-on-failure` before session end when broad changes were made
- **Sanitizer check**: Remind to run with sanitizers (`-DCMAKE_BUILD_TYPE=Sanitizer`) before committing

## Build Commands

```bash
# Format check
clang-format --dry-run --Werror src/*.cpp src/*.hpp

# Static analysis
clang-tidy src/*.cpp -- -std=c++17

# Build
cmake --build build

# Tests
ctest --test-dir build --output-on-failure
```

## Recommended CI Pipeline

1. **clang-format** — formatting check
2. **clang-tidy** — static analysis
3. **cppcheck** — additional analysis
4. **cmake build** — compilation
5. **ctest** — test execution with sanitizers
