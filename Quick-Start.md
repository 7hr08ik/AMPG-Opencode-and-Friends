# Quick Start

## A guide to going from empty folder to building software.

### Step - 1

   -  Make new project folder

### Step - 2

-  Copy Template folder + hidden files
   -  Opencode will pick up the extra files, and use all the python specific knowledge/skills/agents etc.
-  Customize AGENTS.md for the project.
-  Configure .gitignore

>[!NOTE]
>  Project level folders are hidden `/.opencode/` not `/opencode/`. Remember to `Show Hidden Files`

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
/add-context Build full project context
```

More, betterer instructions in `Docs/SDD_Workflow.md`
