# AMPG: OpenCode and friends

*A morons personal guide* and setup for [Opencode](https://opencode.ai/), configured with models locally hosted by [Lemonade Server](https://lemonade-server.ai/)

This config is made for 1 GPU, on 1 PC, with 1 moron hammering at the keyboard.

## 1. Preamble

 - This is made by me, for me, because of me. 
 - I am fully AMD, and Linux (Arch/Manjaro btw!).
 - Fork this, try this, help me improve this.
 - I do not know if this setup works on Microslop.
 - [Lemonade Server](https://lemonade-server.ai/) not required. I include it because thats what I'm running. Its pretty trivial to change the `"baseURL": "http://127.0.0.1:13305/v1"` to Ollama/LM Studio if you need.

This was born from my own journey into the world of making AI do my work for me. I started like most on Claude Code, but I'm cheap...so I looked into [Free Claude Code](https://github.com/Alishahryar1/free-claude-code) and started playing with [Everything Claude Code](https://github.com/affaan-m/ECC). I saw posts claiming to show Karpathy's and Cherny's CLAUDE.md files, so I copied those, and started on my way down the path of combining and optimizing those for my needs.

I started playing around with different local hosting, [LM Studio](https://lmstudio.ai/), [Ollama](https://ollama.com/), then I found [Lemonade Server](https://lemonade-server.ai/). As my whole system is AMD, it was a perfect fit, it even allows me to run a 38GB MoE model, while streaming video through Jellyfin, without any issues. Well, after some tweaking anyway.

I eventually moved on to [Opencode](https://opencode.ai/). I brought along my .md files, and tried to port over what I could/wanted to from ECC. Admittedly not a lot, some agents, some skills, the rules/ folder became templates for individual project level folders, and I was able to port the useful hooks over to Opencode compatible plugins. I do not know typescript, but Qwen3-coder does.

This repo is my personal setup, filled with everything I am using. I have turned my config files into .template files. I include a quick guide for how I have Lemonade setup, and a slightly condescending guide on starting a project/workflow.

Help is always appreciated. If i've done something wrong, please tell me so I can fix it.

## 2. About
Merged various sources of .md files:

Incorporates:
  - [Boris Cherny's CLAUDE.md](https://gist.github.com/hqman/e29cb6386c539d795767e8c3fd2c959b)
    - Basis for my AGENTS.md file
  - [Andrej Karpathy's CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)
    - Incorporated into my .md files
  - [NASA: The Power of Ten](https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code)
    - Merged into INSTRUCTIONS.md
  - [Stackoverflow commenting guidelines](https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/)
    - Merged into INSTRUCTIONS.md
  - Parts of [Everything Claude Code](https://github.com/affaan-m/ECC)
    - Some Agents, Skills, Commands
    - *Plugin hooks:* Converted them into Opencode compatible .ts plugins.
    - *Rules:* Common used in main config. 
    - *Template Rules* Individual per language/environment project level templates.
  - [OpenSpec Driven Development](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/)
  - [Intent Driven Template](https://github.com/intent-driven-dev/intent-driven-template)

Included skills:
  - [Matt Pococks Skills](https://github.com/mattpocock/skills)
  - The Unslop skill from Cursor - https://www.skills.sh/cursor/plugins/unslop
  - Vercel
    - Find-Skills
    - Agent-Browser

My theory is 3 main files:
  - INSTRUCTIONS.md - Operational Instructions.
  - LAWS.md - Immutable laws.

And a collection of common coding rules:
  - instructions/common/*.md
 
A collection of language specific rules, for use at the project level. Taken directly from ECC:
  - Templates/`environment`/AGENTS.md
  - Templates/`environment`/.opencode/[agents/commands/rules/skills]
> Project level folders are hidden `/.opencode/` not `/opencode/`. Remember to `Show Hidden Files`

## 3. Features

  - **[Open Agent Control](https://github.com/darrenhinde/OpenAgentsControl)** - Main Agent Harness/Workflow/Architect.
  - **[Dynamic Context Pruning](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning)** - Prunes context ... Dynamically.
  - **[Codegraph](https://github.com/colbymchenry/codegraph)** - Codebase Memory/Search
  - **[Context7](https://github.com/upstash/context7)** - Online Documentation Search
  - **[opencode-tps-meter](https://github.com/ChiR24/opencode-tps-meter)** - Display Tokens/Sec
  - **[Markitdown-mcp](https://github.com/microsoft/markitdown)** - Document Converter. Microslop made, python based.
  - **[opencode-ignore](https://github.com/lgladysz/opencode-ignore)** - Create .ignore files for AI (Just like .gitignore)
  - **[true-mem](https://github.com/rizal72/true-mem)** - Opencode, Local first, long term memory. 
  (Yes I know about opencode-mem. But it keeps giving me problems, not starting, corrupting etc.)
  - **[Vercel Grep](https://vercel.com/blog/grep-a-million-github-repositories-via-mcp)** Search Github repos
  - **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** A lightweight framework for Spec Driven Development

## 4. Installation

### 4.1. Requirements

API access to some sort of AI model.
- Locally:
  - [Lemonade Server](https://lemonade-server.ai/)
  - [Ollama](https://ollama.com/)
  - [vLLM](https://docs.vllm.ai/en/stable/)
- Cloud

Installed on the system:
- Bun
- pip
- npm

### 4.2. Install Opencode

[OpenCode Docs](https://opencode.ai/docs/)

Install with
```bash
# curl -fsSL https://opencode.ai/install | bash
curl -fsSL https://opencode.ai/v2/install | bash
```

### 4.3. Copy over the Opencode setup

  - Download this repo.
  - Copy/paste the `Opencode` folder contents into `~/.config/opencode`.
  - Overwrite everything when asked.

### 4.4. Plugins

Most features are automatically installed at runtime, thanks to Opencode plugins features.

The following are required to be installed manually:
```bash
# TPS Meter
npx @guard22/opencode-tps-meter install
# Codegraph
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
# Context7
npx ctx7 setup --opencode
# OpenAgentControl
# Keep this at default install location. Otherwise makes the ~/.config/opencode folder messy
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh | bash -s developer
# MarkItDown
pip install 'markitdown[all]' && pip install markitdown-mcp
# OpenSpec
bun add --global @fission-ai/openspec@latest
# Matt Pocock Skills - (Install full MattPocock package)
npx skills@latest add mattpocock/skills
```

```bash
npx ctx7 setup --opencode && \
npx @guard22/opencode-tps-meter install && \
npx skills@latest add mattpocock/skills && \
pip install 'markitdown[all]' && pip install markitdown-mcp && \
bun add --global @fission-ai/openspec@latest && \
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh && \
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/install.sh | bash -s developer
```

## 5. Usage

[Quickstart Guide](Quick-Start.md)
[Full Spec Driven Dev Walkthrough](SDD_Workflow.md)

## 6. Updating

Most updates occur automatically:
  - Opencode autoupdate activated in config
  - Plugins update at runtime

Some plugins require manually updating:

```bash
# Open Agent Control
curl -fsSL https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/update.sh | bash
# Codegraph
codegraph upgrade
# Skills
npx skills@latest update
```

## 7. Notes / Fixes / Workarounds

**ALT + Enter** = Next Line, not send

**Full Reset:** Delete all files. Start again from scratch
```bash
rm -rf ~/.config/opencode ~/.cache/opencode ~/.opencode ~/.local/share/opencode/
```
Then re-install everything

Rare Problems:
 - Occasionally my system will lockup/full GPU driver crash, requiring a hard system reset. This could be so many things....wayland, RAM, VRAM, model settings, the fact i watch Jellyfin while working. I do not believe it is related to Opencode though. More an issue with running AI, and getting Lemonade setting dialed in just right.
 - I have noticed, only twice in 2 weeks of usage, my model Ornith-1.0 has got into a thinking loop. So remember to check the thoughts. Simply hitting ESC twice, and then `continue` seemed to sort it. The task continued just fine without having to restart anything, just interrupt and continue.
