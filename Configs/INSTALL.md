# Installing the AMPG Opencode Configs

This file explains how to install the two config folders shipped in `Configs/` onto your own machine:

- `Configs/opencode/`      -> your OpenCode config folder
- `Configs/billion-context/` -> the Billion Context (bili) config folder

Everything copies under a per-user config directory that differs by operating system.

## Where things go

| OS      | Config root                              |
| ------- | ---------------------------------------- |
| Linux   | `~/.config/`                             |
| macOS   | `~/.config/`                             |
| Windows | `%USERPROFILE%\AppData\Roaming\`         |

The examples below use the Linux path (`~/.config/`). On macOS, use the same `~/.config/`. On Windows, substitute
`%USERPROFILE%\AppData\Roaming\` and run the PowerShell commands. If any tool stores its config elsewhere on your
system, adjust the root accordingly.

## Prerequisites

Install Opencode and your model provider first. See the project `README.md`, sections 4.1-4.2, for:

- [Lemonade Server](https://lemonade-server.ai/) / Ollama / LM Studio
- The `opencode` v2 install

These steps assume `opencode` is already running and pointed at a model.

## 1. Install the OpenCode config folder

OpenCode reads its config from `~/.config/opencode`. Copy the shipped folder over it, overwriting when asked:

```bash
# Linux / macOS
mkdir -p ~/.config
cp -r Configs/opencode/* ~/.config/opencode/

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AppData\Roaming\opencode" | Out-Null
Copy-Item -Recurse -Force Configs\opencode\* "$env:USERPROFILE\AppData\Roaming\opencode\"
```

> The core config does not self-copy. Re-run this after every change you make under `Configs/opencode/`.

## 2. Install the Billion Context folder

Billion Context (the `bili` CLI) reads its settings from `billion-context.json`. Copy the shipped file into the
billion-context config folder:

```bash
# Linux / macOS
mkdir -p ~/.config/billion-context
cp Configs/billion-context/billion-context.json ~/.config/billion-context/billion-context.json

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\AppData\Roaming\billion-context" | Out-Null
Copy-Item Configs\billion-context\billion-context.json "$env:USERPROFILE\AppData\Roaming\billion-context\billion-context.json"
```

Then ensure the opencode plugin is registered with bili (install bili first if needed):

```bash
npm install -g billion-context   # if not already installed
bili plugin install opencode
```

## 3. Verify

- OpenCode: run `opencode` and confirm your model loads and plugins (Codegraph, Context7, etc.) appear.
- Billion Context: run `bili` and check that your models and compression settings are read from the config file.
