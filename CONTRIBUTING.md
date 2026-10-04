# Contributing

Thanks for wanting to help. This repo is a living config recipe, so the best
contributions are the "hey, this works better now" kind.

## What this repo is

An installable [Opencode](https://opencode.ai/) config setup, **not an app** -
there's nothing to build or unit-test the usual way. Contributions improve the
config, the docs, or the starter template.

## Where things live

- `Configs/opencode/` is the **source of truth**. It's what installs to
  `~/.config/opencode/`. **Edit changes here**, not in your local copy.
- The core config does **not** self-copy. After editing, copy `Configs/opencode/*`
  over `~/.config/opencode/` (overwrite when asked) to actually test your change.
  See [`Configs/INSTALL.md`](Configs/INSTALL.md).
- `Project_Template/` is the starter template for new projects - keep it clean.

## How to make a change

1. **Fork** this repo and clone it.
2. Create a branch: `git checkout -b fix-or-feature`.
3. Make your change in `Configs/opencode/` (or docs/templates as appropriate).
4. **Test it**: copy your changes over and try them in a real Opencode session.
   With no automated test suite here, manual verification is the whole game.
5. Keep it small and focused - one thing at a time.

## Committing

Commits are made **manually by the repo owner**, so when you submit work, please:

- Use [conventional commit format](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, ...).
- Keep commits modular, with a message that explains the change and its impact.

If you open a Pull Request, I'll pick it up, test it against my setup, and commit
it. If you'd rather commit yourself, that's fine too - just follow the convention
above.

## The workflow (for bigger changes)

Larger changes follow the OpenSpec spec-driven flow:

```
opsx:explore → opsx:propose → opsx:apply → opsx:verify → opsx:archive
```

Explore the problem, propose a plan, apply it, verify it, then archive. See
[`AGENTS.md`](AGENTS.md) for the details.

## Reporting bugs & requesting features

- [Bug report](.github/ISSUE_TEMPLATE/bug_report.yml)
- [Feature request](.github/ISSUE_TEMPLATE/feature_request.yml)

> [!NOTE]
> The shipped config points at `http://127.0.0.1:13305/v1`. When testing, point
> it at your own model server by swapping the `baseURL` in
> `Configs/opencode/opencode.jsonc`.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
