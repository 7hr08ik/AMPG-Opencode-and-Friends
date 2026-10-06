# AMPG: OpenCode and friends

*A Morons Personal Guide* for [Opencode](https://opencode.ai/), built on locally-hosted models via [Lemonade Server](https://lemonade-server.ai/).

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 1. TL;DR

- This is a [Opencode 2](https://opencode.ai/) **config recipe**, not an app. Fork it, tweak it, make it yours.
- Follow the instructions, there are a few things to install.
- I run everything on **AMD + Linux**. Tested on one GPU, one PC, one over-caffeinated developer.
- **[Lemonade Server](https://lemonade-server.ai/) is not required.** The config points at a standard OpenAI-compatible endpoint, so it works with Ollama, LM Studio, vLLM, or cloud. Just swap the `baseURL`.
- It's mine, for me - published so someone can grab a useful piece. If I've done something wrong, tell me and I'll fix it.

## 2. What this actually is

A single Git repo holding a working Opencode configuration, a starter template for new projects, and the reference docs along the way. There's nothing to build - you copy the `Configs/` folders over your own config and go.

```
├── Configs/
│   ├── opencode/            # the installable Opencode config (the good stuff)
│   │   ├── opencode.jsonc   #   providers, models, plugins, permissions
│   │   ├── cli.json
│   │   ├── agents/
│   │   ├── commands/        #   opsx-* workflow + dev commands
│   │   ├── skills/          #   OpenSpec + openspec-git-discipline + misc
│   │   └── rules/           #   Environment coding/security/testing rules
│   └── billion-context/
│       └── billion-context.json   # the Billion Context (bili) config
├── Project_Template/        # starter layout for a new project
├── Resources/               # reference docs I leaned on
│   ├── Lemonade-Server.md   #   how my Lemonade instance is set up
│   └── SDD_Workflow.md      #   spec-driven development walkthrough
├── Quick-Start.md           # empty folder -> running project in a few steps
├── AGENTS.md                # instructions for agents working in this repo
└── README.md                # you are here
```

## 3. The story (skip if you want)

I started like most people: on [Claude Code](https://claude.ai/). But I'm cheap, so I went hunting for [Free Claude Code](https://github.com/Alishahryar1/free-claude-code) and started playing with [Everything Claude Code](https://github.com/affaan-m/ECC). I'd seen the claims about Karpathy's and Boris Cherny's `CLAUDE.md` files, copied them, and started optimizing for my own needs.

Eventually I moved on to [Opencode](https://opencode.ai/). I brought my `.md` files along and ported what I could from ECC: some agents, some skills, and the `rules/` folder became templates for individual project-level folders. I hooks got converted into Opencode-compatible plugins. (I don't know TypeScript, but Qwen3-coder does.)

## 4. Features / tools in the setup

Additional Tools

  - **[Open Agent Control](https://github.com/darrenhinde/OpenAgentsControl)** - AI agents that learn YOUR coding patterns and generate matching code every time.
  - **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** - A lightweight framework for spec-driven development.
  - **[Opencode-mem](https://github.com/tickernelz/opencode-mem)** - A persistent memory system for AI coding agents.
  - **[Superpowers](https://github.com/obra/superpowers)** - An agentic skills framework.
  - **[Matt Pocock's Skills](https://github.com/mattpocock/skills)** - Skills for Real Engineers. Straight from Mr Pocock's .agents directory.
  - **[Awesome AGENTS.md](https://github.com/khasky/awesome-agents-md)** - A ruleset written in the AGENTS.md format, with shared rules for AI coding agents

Background plugins

  - **[Billion Context](https://github.com/ranxianglei/billion-context)** - Dynamic configurable context management.
  - **[Codegraph](https://github.com/colbymchenry/codegraph)** - Codebase memory & search.
  
MCPs

  - **[Draw.io](https://github.com/jgraph/drawio-mcp/blob/main/mcp-tool-server/README.md)** - Draw.io, for diagrams etc.
  - **[Playwrite](https://github.com/microsoft/playwright-mcp)** - AI Browser automation.
  - **[Context7](https://github.com/upstash/context7)** - Online documentation search.
  - **[MarkItDown](https://github.com/microsoft/markitdown)** - Document converter.
  - **[Vercel Grep](https://vercel.com/blog/grep-a-million-github-repositories-via-mcp)** - Search GitHub repos.

And some custom plugins I created for myself.
These plugins were originally ported from ECC hooks, converted to opencode plugins, and tweaked.

| Plugin | What it does |
| --- | --- |
| [`code-review-cycle.ts`](Configs/opencode/plugins/code-review-cycle.ts) | Runs before `git commit`: scans the patch for conflict markers, unused variables, and security-sensitive files, then makes you review before re-committing. |
| [`coding-style.ts`](Configs/opencode/plugins/coding-style.ts) | Runs on every edit. Enforces house style: short functions, flagged mutations, bounded nesting/loops, and real assertion density. |
| [`env-protection.ts`](Configs/opencode/plugins/env-protection.ts) | Blocks the `read` tool from opening `.env` files and secret keys (`id_rsa`, `.aws/`, `credentials.json`, …) before their contents reach the model. |
| [`git-workflow.ts`](Configs/opencode/plugins/git-workflow.ts) | Enforces conventional commit messages (plus the AI-generated tag) on every `git commit` - refuse-and-fix, no free-form commits. |
| [`security.ts`](Configs/opencode/plugins/security.ts) | Scans every edit for leaked secrets (AWS keys, private keys, tokens, connection strings) and dangerous shell commands like `rm -rf`. |
| [`testing.ts`](Configs/opencode/plugins/testing.ts) | At session end, tallies what you changed without tests and chases you to add them - keeps you honest on TDD. |
| [`workflow.ts`](Configs/opencode/plugins/workflow.ts) | Throttles runaway `glob` searches and nudges you toward `codegraph_explore` (with a warning on repo-wide grep). |
| [`lib/guards.ts`](Configs/opencode/plugins/lib/guards.ts) | Shared helpers every plugin leans on - tool-type checks and writing-content extraction. Not a plugin itself. |
| [`lib/output.ts`](Configs/opencode/plugins/lib/output.ts) | Shared warning/error helpers. Falls back to stdout when there's no toast to show. |

## 5. Installation

### 5.1. Requirements

- **Something to run a model** - either locally or via the cloud:
  - Local: [Lemonade Server](https://lemonade-server.ai/), [Ollama](https://ollama.com/), or [vLLM](https://docs.vllm.ai/en/stable/)
  - Cloud: whatever API you like
- **Runtimes on your system:** 
  - [Bun](https://bun.sh/)
  - [pip](https://pypi.org/project/pip/)
  - [npm](https://www.npmjs.com/)

### 5.2. Install Opencode 2

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

(See the [Opencode Docs](https://opencode.ai/v2/docs) for other install methods.)

### 5.3. Copy over the config

The installable configs live in `Configs/`. See **`Configs/INSTALL.md`** for the exact, cross-platform copy steps
(Linux, macOS, PowerShell), but the gist is:

```bash
# Copy the Opencode config and the Billion Context config over your own
cp -r Configs/opencode/*      ~/.config/opencode/
cp Configs/billion-context/   ~/.config/billion-context/
```

Overwrite if asked.

> The core config does **not** self-copy. After any change to `Configs/opencode/`, re-run the copy.

### 5.4. Install the plugins

Most plugins are picked up automatically by Opencode. The following may need a one-time manual install:

```bash
# Billion Context
npm install -g billion-context
bili plugin install opencode

# Context7
npx ctx7 setup --opencode

# Codegraph  (run in a separate terminal)
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
codegraph install

# OpenAgent Control  (keep the default install location, or ~/.config/opencode gets messy)
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh | bash -s developer

# MarkItDown
pip install 'markitdown[all]' && pip install markitdown-mcp

# OpenSpec
bun add --global @fission-ai/openspec@latest

# Matt Pocock Skills
npx skills@latest add mattpocock/skills
```

AIO
```bash
npm install -g billion-context && bili plugin install opencode && \
npx ctx7 setup --opencode && \
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh && \
codegraph install && \
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh | bash -s developer && \
pip install 'markitdown[all]' && pip install markitdown-mcp && \
bun add --global @fission-ai/openspec@latest && \
npx skills@latest add mattpocock/skills
```

## 6. Usage

- **[Quick-Start.md](Quick-Start.md)** - go from an empty folder to a running project.
- **[Docs/SDD_Workflow.md](Docs/SDD_Workflow.md)** - full spec-driven development walkthrough.
- **[Docs/Lemonade-Server.md](Docs/Lemonade-Server.md)** - how my Lemonade instance is configured.

## 7. Updating

- **Opencode** auto-updates (enabled in the config).
- **Most plugins** update themselves at runtime.
- **A few** need a manual nudge:

```bash
# OpenAgent Control
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/update.sh | bash
# Codegraph
codegraph upgrade
# Skills
npx skills@latest update
# Openspec
openspec update
```

AIO
```bash
cd && curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/update.sh | bash && \
codegraph upgrade && \
npx skills@latest update && \
openspec update
```

## 8. Notes, fixes & how I un-break things

- **ALT + Enter** = next line, not send. (This one catches people out.)
- **Thinking loops** are rare but real. If the model gets stuck, hit `ESC` twice then `continue` - the task just carries on, no restart needed.
- **Full reset** - nuke everything and start fresh:

  ```bash
  rm -rf ~/.config/opencode ~/.cache/opencode ~/.opencode ~/.local/share/opencode/
  ```

## 9. Contributing

Forks, tweaks, and "hey, this is broken" reports are all welcome. If you've made it work somewhere I haven't (Windows, a second GPU, a cloud model), a note - or a pull request - would be appreciated.

## 10. License

This project is licensed under the [MIT License](LICENSE). Fork it, use it, make something of it.

## 11. Acknowledgments

Built on the shoulders of people who wrote the good bits first:

- [Boris Cherny's CLAUDE.md](https://gist.github.com/hqman/e29cb6386c539d795767e8c3fd2c959b) - basis for the `AGENTS.md` file
- [Andrej Karpathy's CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) - woven into the `.md` files
- [NASA: The Power of Ten](https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code) - safety-minded rules
- [Stack Overflow: Best practices for writing code comments](https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/) - comment guidance
- [Everything Claude Code](https://github.com/affaan-m/ECC) - some agents, skills, commands. Converted and updated for use with Opencode
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [Intent Driven Templates + Schemas](https://github.com/intent-driven-dev/intent-driven-template)
