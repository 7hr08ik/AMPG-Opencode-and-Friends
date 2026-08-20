# Quick Start

## A guide to going from empty folder to building software.

### Basics
 - Make new project folder
 - Open terminal inside project folder


### Customize setup
 - Copy Template folder for coding environment
    -   e.g; Coding in python. Copy the contents of the python template, into the `root` of your project.
    -   Opencode will pick up the extra files, and use all the python specific knowledge/skills/agents etc.
    >[!NOTE]
    > Project level folders are hidden `/.opencode/` not `/opencode/`. Remember to `Show Hidden Files`
 - Customize AGENTS.md for the project.


## Initialize stuff

From inside your project root:

```bash
# Initialize the folder as git repo
git init
# Initialize codegraph
codegraph init
# Initialize OpenSpec
openspec init
# All in one
git init && codegraph init && openspec init

# Run opencode
opencode
/init
```

Now you can start vibe-coding that awesome idea you had.

