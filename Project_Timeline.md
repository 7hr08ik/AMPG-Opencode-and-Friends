# Project Timeline

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
# Run opencode
opencode
/init
```
Now you can start vibe-coding that awesome idea you had.

## Getting great prompts.

Don't just prompt for your task. 
Prompt, to optimize your prompt, for an AI generated Plan for a task.

Why spend all the calories, burning grey matter, trying to craft the perfect prompt? Instead, use this amazing AI stuff I just heard about. It can take what you tell it, and turn it into the perfect set of instructions for another AI to read. So my plan is now to type out my prompt to get the AI to plan the project. The optimize that prompt before use. This way we can get better results from the actual work being done.

1. First start by writing your prompt, to generate a Plan.

```text
Optimize this prompt using `prompt-optimizer`: 

- Create a thorough and concise prompt, to tell my agent to plan a project.
- Create a thorough plan, and plan files.
- Use TodoWrite, to track the plan and project. Marking items off as you go.
- Test Driven Development. Follow the TDD Workflow laid out in `opencode/instructions/common/testing.md`.
- Itemize everything, make each step as small as possible.
- Ask me clarifying questions, if there are multiple options for frameworks/libraries etc.
- Verify any choices made with the user.

The project will be ...
```
*Or something to that effect...*

2. Get your output from the first step. Go through it, tweak and fiddle. Use the optimized prompt to generate your optimized plan.

3. Run the optimized prompt, to create the plan and start work.