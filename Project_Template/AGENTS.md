# AGENTS.md

This is the project level AGENTS.md file.

Currently this file is a template form. The user must complete this form before running /init on any project.

## Product/Feature Name
Project name: <name-me>
Summary: 

## Folder Architecture
```
Project_Folder/
├── .opencode/              # Project level configs and extra files for opencode.
├── openspec/               # Config files for OpenSpec
├── Project_Notes.txt       # User notes, etc
├── .env                    # Environment variables. Keys etc. -- Make sure its ignored where necessary
├── .gitignore              # The git ignore file
├── AGENTS.md               # Basic template. Complete form, then run /init
└── opencode.jsonc          # Required for loading additional tools
```

---

## **Objective**

<objectify-me>

## **Success metrics**
| **Goal** | **Metric** |
| --- | --- |
|  |  |
|  |  |

## **Assumptions**

## **Milestones**

## **Requirements**
| **Requirement** | **User Story** | **Importance** | **Jira Issue** | **Notes** |
| --- | --- | --- | --- | --- |
|  |  | **HIGH** |  |  |
|  |  |  |  |  |

## **User interaction and design**

## **Open Questions**
| **Question** | **Answer** | **Date Answered** |
| --- | --- | --- |
|  |  |  |

## **Out of Scope**
- 

## **Reference materials**

---

## Rules
Language-specific rules are loaded from `.opencode/rules/*/*.md`.
Common rules from the global installation provide additional cross-cutting checks.

## Required Tooling

OpenCode runs auto-formatting and linting hooks after every file edit. These tools must be installed for the hooks to work. Run the **Verify** command for each tool -- if it prints a path or version, it is installed. If it prints nothing or an error, run the **Install** command.


### Formatter: `black` (Python)

```bash
# Verify
which black && black --version

# Install
pip install black
# or: pipx install black
```

### Linter: `ruff` (Python)

```bash
# Verify
which ruff && ruff --version

# Install
pip install ruff
# or: pipx install ruff
# or (Linux/macOS): curl -sSf https://sh.ruff.dev | sh
```

### Formatter: `prettier` (TypeScript, JS, JSON, YAML, HTML, Markdown)

Prettier is bundled with bun.

```bash
# Verify
bun --version

# Install bun (if needed)
curl -fsSL https://bun.sh/install | bash
# Then restart your shell or run: source ~/.zshrc (or ~/.bashrc)
```

### Linter: `eslint` (TypeScript, JS)

```bash
# Verify
which eslint && eslint --version

# Install globally
npm install -g eslint
```

### Linter: `swiftlint` (Swift)

```bash
# Verify
which swiftlint && swiftlint --version

# Install (macOS)
brew install swiftlint
```

### Formatter: `cargo fmt` (Rust)

Built into cargo (Rust toolchain). No separate install needed.

```bash
# Verify
cargo fmt --version
```

### Linter: `cargo clippy` (Rust)

Built into cargo (Rust toolchain). No separate install needed.

```bash
# Verify
cargo clippy --version
```

### Formatter / Linter: `rubocop` (Ruby)

RuboCop serves as both formatter and linter for Ruby.

```bash
# Verify
which rubocop && rubocop --version

# Install
gem install rubocop
# or: brew install rubocop (macOS)
```

### Formatter: `pint` (PHP)

Laravel's opinionated PHP formatter.

```bash
# Verify
which pint && pint --version

# Install (via Composer, project-level or global)
composer global require laravel/pint
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```

### Linter: `phpstan` (PHP)

```bash
# Verify
which phpstan && phpstan --version

# Install (via Composer)
composer global require phpstan/phpstan
# Add ~/.config/composer/vendor/bin to PATH if needed:
# export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```

### Formatter / Linter: Perl

There are no Perl-specific formatter or linter hooks configured in the current plugin set. Perl files will not be auto-formatted or linted by OpenCode hooks. If you want to add Perl tooling, you can install `perlcritic` for linting:

```bash
# Verify
which perlcritic && perlcritic --version

# Install
cpan install Perl::Critic
```

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

### Formatter: `google-java-format` (Java)

```bash
# Verify
which google-java-format && google-java-format --version

# Install (JAR-based, works on any OS with JDK)
mkdir -p ~/.local/bin
curl -Lo ~/.local/bin/google-java-format.jar \
  https://github.com/google/google-java-format/releases/download/v1.23.0/google-java-format-1.23.0-all-deps.jar
cat > ~/.local/bin/google-java-format << 'EOF'
#!/bin/bash
exec java -jar "$HOME/.local/bin/google-java-format.jar" "$@"
EOF
chmod +x ~/.local/bin/google-java-format
```

### Linter: `checkstyle` (Java)

Checkstyle requires a config XML file. Download one and create a wrapper:

```bash
# Verify
which checkstyle

# Install (JAR-based)
mkdir -p ~/.local/bin
curl -Lo ~/.local/bin/checkstyle.jar \
  https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.21.1/checkstyle-10.21.1-all.jar
curl -Lo ~/.local/bin/checkstyle.xml \
  https://raw.githubusercontent.com/checkstyle/checkstyle/master/src/main/resources/google_checks.xml
cat > ~/.local/bin/checkstyle << 'EOF'
#!/bin/bash
exec java -jar "$HOME/.local/bin/checkstyle.jar" -c "$HOME/.local/bin/checkstyle.xml" "$@"
EOF
chmod +x ~/.local/bin/checkstyle
```

### Formatter: `gofmt` (Go)

Built into the Go SDK. No separate install needed.

```bash
# Verify
gofmt --version
```

### Linter: `go vet` (Go)

Built into the Go SDK. No separate install needed.

```bash
# Verify
go vet ./...
```

### Linter: `shellcheck` (Shell scripts)

```bash
# Verify
which shellcheck && shellcheck --version

# Install (Linux)
sudo apt install shellcheck
# or: sudo pacman -S shellcheck

# Install (macOS)
brew install shellcheck
```

### Formatter: `fantomas` (F#)

Part of the .NET SDK tooling.

```bash
# Verify
which fantomas && fantomas --version

# Install (via .NET SDK global tool)
dotnet tool install -g fantomas-tool
```

### Formatter: `dart format` (Dart)

Built into the Dart SDK. No separate install needed.

```bash
# Verify
dart format --version
```


### Formatter: `clang-format` (C, C++, Objective-C)

```bash
# Verify
which clang-format && clang-format --version

# Install (Linux)
sudo apt install clang-format
# or: sudo pacman -S clang

# Install (macOS)
brew install clang-format
```

### Linter: `clang-tidy` (C, C++)

```bash
# Verify
which clang-tidy && clang-tidy --version

# Install (Linux)
sudo apt install clang-tidy
# or: sudo pacman -S clang

# Install (macOS)
brew install clang
```

