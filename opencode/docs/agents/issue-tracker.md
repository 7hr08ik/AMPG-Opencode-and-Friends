# Issue Tracker

Issues for this repo are tracked as markdown files under `.scratch/<feature>/`.

**Workflow:**
- Create an issue: `mkdir -p .scratch/<issue-name>` and add a description file
- Reference an issue: `.scratch/<issue-name>/description.md`
- Close an issue: remove the issue directory

This setup is designed for solo projects or repos without a remote issue tracker. The `to-tickets`, `triage`, and `to-spec` skills will read from and write to these markdown files.

**PRs as a request surface:** Defaulted **off**. Enable if you want external PRs in the triage queue.