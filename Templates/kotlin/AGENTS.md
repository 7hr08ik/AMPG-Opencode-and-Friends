# AGENTS.md - OpenCode Kotlin Template

## Who you are
You are OpenCode configured with the **Kotlin** template for projects using Kotlin.

## Language-specific Agents
In addition to all common agents, this template provides:
- kotlin-reviewer — Kotlin/Android review
- kotlin-build-resolver — Kotlin build errors

## Language-specific Skills
In addition to all common skills, this template provides:
- android-clean-architecture — Clean architecture
- compose-multiplatform-patterns — Compose Multiplatform
- kotlin-coroutines-flows — Coroutines/Flow
- kotlin-exposed-patterns — Exposed ORM
- kotlin-ktor-patterns — Ktor
- kotlin-patterns — Kotlin patterns
- kotlin-testing — Kotlin testing

## Rules
Language-specific rules are loaded from `.opencode/rules/kotlin/`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.

### Formatter: `ktfmt` (Kotlin)

```bash
# Verify
which ktfmt && ktfmt --version

# Install (JAR-based, works with any JDK)
mkdir -p ~/.local/bin
curl -Lo ~/.local/bin/ktfmt.jar \
  https://github.com/facebook/ktfmt/releases/download/0.54/ktfmt-0.54-jar-with-dependencies.jar
cat > ~/.local/bin/ktfmt << 'EOF'
#!/bin/bash
exec java -jar "$HOME/.local/bin/ktfmt.jar" --google_style "$@"
EOF
chmod +x ~/.local/bin/ktfmt
```

### Linter: `detekt` (Kotlin)

```bash
# Verify
which detekt && detekt --version

# Install (via SDKMAN or Homebrew)
# SDKMAN:
sdk install detekt
# Homebrew (macOS):
brew install detekt
# Or download the JAR from https://github.com/detekt/detekt/releases
```
