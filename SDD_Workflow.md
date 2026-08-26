# SDD Workflow

1. Setup folder
    - Copy templates
    - Create/Copy project folder
2. Init everything
    - git init && codegraph init && openspec init
3. Opencode
    - /init - To bring it all together
    - /opsx-explore
4. ?
5. Profit


## Tips

> [!Rule-of-thumb] The fuzzier the task, the more explore pays off. The clearer the task, the more you can skip straight to proposing.

When you know what you want to build and just need to execute:
    
    /opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive


## Project Folder Setup

- Use Main template to create project folder boilerplate.
    - Rename whats needed
- Open Project folder in your IDE.
- Copy in environment specific templates.
    - Merge the AGENTS.md with multiple environment details, if needed.
- Configure:
    - Templates
        - AGENTS.md
        - env_template
        - gitignore_template
    - Openspec config.yaml
- Init all the things
    - git init && codegraph init && openspec init
    - opencode
        - /init


## Building - Workflow

[KISS](Keep It Simple Stupid)
    Small itterative changes. No building a new DLC in 1 prompt.

- Have idea! Go! Think now!
    - Just jot things down in notepad
    - Refine the idea (Optional)
        - `/idea-refine` - Make AI figure shit out first. 
        - Debate the pro's and con's of the idea/project/feature

- New branch
        
- Explore idea properly
    - /opsx-explore "your idea"

- Build the spec
    - /opsx-propose "your idea"
    - Go more granular if you want:
        - /opsx:new                        # scaffold only
        - /opsx:continue                   # create one artifact at a time
        - /opsx:ff add-dark-mode           # create all planning artifacts at once
        - /opsx:update add-dark-mode - we're storing the theme in a cookie now
        - /opsx:sync                       # Merge changes to main specs

- Apply tasks - Build the thing
    - /opsx:apply <name>                   # (Optional) Set <name> for individual tasks

- Checks - Tests 

    - /code-review
    - Language Specific Review/Testing
    - /optimize
    - /opsx:verify                         # Check its correct

- git
    - Commit/Push/PR
    
- Done.
    - /opsx:archive                        # Move to archive when done


## Command Reference

| Command | What it does |
|---------|--------------|
| `/opsx:explore` | Think through ideas, investigate problems, clarify requirements |
| `/opsx:propose` | Create a change and generate planning artifacts in one step (default quick path) |
| `/opsx:update` | Revise a change's planning artifacts and keep them coherent |
| `/opsx:sync` | Merge delta specs into main specs (optional) |
| `/opsx:continue` | Create the next artifact (expanded workflow) |
| `/opsx:new` | Start a new change scaffold (expanded workflow) |
| `/opsx:ff` | Fast-forward planning artifacts (expanded workflow) |
| `/opsx:apply` | Implement tasks, updating artifacts as needed |
| `/opsx:bulk-archive` | Archive multiple completed changes (expanded workflow) |
| `/opsx:verify` | Validate implementation against artifacts (expanded workflow) |
| `/opsx:archive` | Archive when done |
| `/opsx:onboard` | Guided walkthrough of an end-to-end change (expanded workflow) |

## Bug fixing

