---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
---
# Rust Hooks

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **cargo fmt**: Auto-format `.rs` files after edit
- **cargo clippy**: Run lint checks after editing Rust files
- **cargo check**: Verify compilation after changes (faster than `cargo build`)
