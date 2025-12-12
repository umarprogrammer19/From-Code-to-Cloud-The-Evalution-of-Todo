---
id: "001"
title: "interactive-cli"
stage: "refactor"
date_iso: "2025-12-13"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "interactive-cli"
branch: "main"
user: "Umar Farooq"
command: "Implement interactive CLI mode with rich banners and questionary"
labels: ["cli", "interactive", "ui", "ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\pyproject.toml"
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\src\\todo.py"
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\src\\cli\\commands.py"
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\specs\\002-interactive-cli\\spec.md"
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\specs\\002-interactive-cli\\plan.md"
  - "C:\\Users\\Umar Farooq\\Desktop\\From-Code-to-Cloud-The-Evalution-of-Todo\\specs\\002-interactive-cli\\tasks.md"
tests_yaml: []
prompt_text: |
  @agent-cli-engineer I want to refactor the CLI to be **Interactive**.

  **New Requirements**:
  1. **Entry Point**: When the app starts, show a specialized "Welcome to Todo GenAI" banner using `rich.figlet`.
  2. **Main Menu**:
     - Use `questionary` to show a list of options:
       - "➕ Add Task"
       - "📋 List Tasks"
       - "✅ Complete Task", "Update Task"
       - "❌ Delete Task"
       - "🚪 Exit"
     - This must run in a loop until the user selects "Exit".
  3. **Workflows**:
     - **Add**: Ask for "Title" then "Priority" (Select list) using `questionary`.
     - **Complete/Delete**: Show a list of existing tasks to select from (don't make user type ID).
  4. **UI**: Keep the `rich` coloring for success/error messages.
response_text: |
  Successfully implemented the interactive CLI mode with the following changes:

  1. Created specification files (spec.md, plan.md, tasks.md) for the interactive CLI feature
  2. Updated pyproject.toml to add pyfiglet and questionary dependencies
  3. Modified src/todo.py to detect if arguments are passed and run interactive mode when no args
  4. Enhanced src/cli/commands.py with:
     - Rich figlet banner display function
     - Interactive menu system with questionary
     - Separate handlers for each menu option
     - Improved UI with rich colors and symbols
     - Confirmation for delete operations
     - Preserved original command-line functionality

  The application now supports both interactive mode (when run without arguments) and traditional command-line mode (when run with arguments).
outcome: "Successfully implemented interactive CLI with rich banner and questionary menus"
evaluation: "All requirements met: banner, menu, workflows, and UI enhancements"
---