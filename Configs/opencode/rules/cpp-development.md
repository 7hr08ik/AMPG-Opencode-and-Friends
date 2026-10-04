Read this when developing/coding in C++ (cpp). This consolidated file merges all C++ rule topics; follow it consistently.

---
paths:
  - "**/*.cc"
  - "**/*.cpp"
  - "**/*.cxx"
  - "**/*.h"
  - "**/*.hh"
  - "**/*.hpp"
  - "**/CMakeLists.txt"
---

# C++ Development


## C++ Coding Style

## Modern C++ (C++17/20/23)

- Prefer **modern C++ features** over C-style constructs
- Use `auto` when the type is obvious from context
- Use `constexpr` for compile-time constants
- Use structured bindings: `auto [key, value] = map_entry;`

## Resource Management

- **RAII everywhere** - no manual `new`/`delete`
- Use `std::unique_ptr` for exclusive ownership
- Use `std::shared_ptr` only when shared ownership is truly needed
- Use `std::make_unique` / `std::make_shared` over raw `new`

## Naming Conventions

- Types/Classes: `PascalCase`
- Functions/Methods: `snake_case` or `camelCase` (follow project convention)
- Constants: `kPascalCase` or `UPPER_SNAKE_CASE`
- Namespaces: `lowercase`
- Member variables: `snake_case_` (trailing underscore) or `m_` prefix

## Formatting

- Use **clang-format** - no style debates
- Run `clang-format -i <file>` before committing

## Coding Style Reference

See skill: `cpp-coding-standards` for comprehensive C++ coding standards and guidelines.


## C++ Patterns

## RAII (Resource Acquisition Is Initialization)

Tie resource lifetime to object lifetime:

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path) : file_(std::fopen(path.c_str(), "r")) {}
    ~FileHandle() { if (file_) std::fclose(file_); }
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
private:
    std::FILE* file_;
};
```

## Rule of Five/Zero

- **Rule of Zero**: Prefer classes that need no custom destructor, copy/move constructors, or assignments
- **Rule of Five**: If you define any of destructor/copy-ctor/copy-assign/move-ctor/move-assign, define all five

## Value Semantics

- Pass small/trivial types by value
- Pass large types by `const&`
- Return by value (rely on RVO/NRVO)
- Use move semantics for sink parameters

## Error Handling

- Use exceptions for exceptional conditions
- Use `std::optional` for values that may not exist
- Use `std::expected` (C++23) or result types for expected failures

## Patterns Reference

See skill: `cpp-coding-standards` for comprehensive C++ patterns and anti-patterns.


## C++ Security

## Memory Safety

- Never use raw `new`/`delete` - use smart pointers
- Never use C-style arrays - use `std::array` or `std::vector`
- Never use `malloc`/`free` - use C++ allocation
- Avoid `reinterpret_cast` unless absolutely necessary

## Buffer Overflows

- Use `std::string` over `char*`
- Use `.at()` for bounds-checked access when safety matters
- Never use `strcpy`, `strcat`, `sprintf` - use `std::string` or `fmt::format`

## Undefined Behavior

- Always initialize variables
- Avoid signed integer overflow
- Never dereference null or dangling pointers
- Use sanitizers in CI:
  ```bash
  cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
  ```

## Static Analysis

- Use **clang-tidy** for automated checks:
  ```bash
  clang-tidy --checks='*' src/*.cpp
  ```
- Use **cppcheck** for additional analysis:
  ```bash
  cppcheck --enable=all src/
  ```

## Security Reference

See skill: `cpp-coding-standards` for detailed security guidelines.


## C++ Testing

## Framework

Use **GoogleTest** (gtest/gmock) with **CMake/CTest**.

## Running Tests

```bash
cmake --build build && ctest --test-dir build --output-on-failure
```

## Coverage

```bash
cmake -DCMAKE_CXX_FLAGS="--coverage" -DCMAKE_EXE_LINKER_FLAGS="--coverage" ..
cmake --build .
ctest --output-on-failure
lcov --capture --directory . --output-file coverage.info
```

## Sanitizers

Always run tests with sanitizers in CI:

```bash
cmake -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined" ..
```

## Testing Reference

See skill: `cpp-testing` for detailed C++ testing patterns, TDD workflow, and GoogleTest/GMock usage.


## C++ Hooks

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
## Format check
clang-format --dry-run --Werror src/*.cpp src/*.hpp

## Static analysis
clang-tidy src/*.cpp -- -std=c++17

## Build
cmake --build build

## Tests
ctest --test-dir build --output-on-failure
```

## Recommended CI Pipeline

1. **clang-format** - formatting check
2. **clang-tidy** - static analysis
3. **cppcheck** - additional analysis
4. **cmake build** - compilation
5. **ctest** - test execution with sanitizers
