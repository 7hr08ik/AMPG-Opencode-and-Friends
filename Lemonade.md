# AMPG: Lemonade Server

[Lemonade Website](https://lemonade-server.ai/)

[Lemonade Github](https://github.com/lemonade-sdk/lemonade)

## Quick basics

- Lemonade has a GUI but thats mainly for chatting from what I can see.
- GUI also used for image gen models.
- All models listed in the GUI at start, are the recommended/supported models.
- Other models can be downloaded from huggingface, by simply searching the name in the GUI.
    e.g: Qwopus models work, but not listed. Type in `Qwopus3.6-27B` and find what you want.

- MTP = Newer algorythms. These model versions are faster at token gen, no performance loss, but hosting must support it. (Had varying results on lemonade with models).
- Quants = level of compression. More compress = Smaller, but less accurate.
- MoE = Mixture of Experts. This is where the magic happens. Hosting apps, can load ONLY the required/active layers of the model into VRAM.
        This is how i am running a 37GB q8_0 quant model on my 20GB 7900xt, at ~30-50 tk/s

## Install

Its now in the main Arch repo.

- lemonade-server
- lemonade-desktop

## Terminal Config

### View config
```bash
lemonade config
```

### Set Manual options

1. Turn on auto unmount model after 1800 seconds
2. Set max context size (Results may vary) This setting works for me.
3. Settings for hosting
    - Set quant compression for K and V cache.
    - Flash Attentions - ON. (Throughput performance tweak)
    - Parallel - This is how many USERS can access your hosted model at the same time.
    - b + ub are chunk sizes for token processing. Bigger = Faster but more memory used.
    - mlock - Stop the PC from swapping data out of RAM and onto Disk

```bash
lemonade config set auto_evict true
lemonade config set auto_evict_threshold_pct 1
lemonade config set ctx_size 220000
lemonade config set global_timeout=1800
lemonade config set llamacpp.args="--cache-type-k q4_0 --cache-type-v q4_0 --flash-attn on --parallel 2 -b 4096 -ub 1024 --fit on --fit-target 2048 --reasoning-budget 8192"

```

## Desktop UI Config

All of these models can be found in Lemonade simply by typing their name in the search bar.

### Preconfigured Models

These are what are configured in Opencode right now.

Coding BEAST:
 - [Ornith-1.0-35B](https://huggingface.co/deepreinforce-ai/Ornith-1.0-35B-GGUF)
    - (Q8_0)

Thinking/Reasoning:
 - [Qwen3.6-35B-A3B](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-MTP-GGUF)
    - (Q8_0)

VSCode Completion:
 - [Qwopus3.5-9B-Coder-MTP](https://huggingface.co/Jackrong/Qwopus3.5-9B-Coder-MTP-GGUF)
    - (Q8_0)
