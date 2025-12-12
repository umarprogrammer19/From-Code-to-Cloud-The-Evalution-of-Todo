---
id: 002
title: refactor-app-cli-engineer
stage: implement
date: 2025-12-13
model: Claude Sonnet 4.5
feature: 002-interactive-cli
branch: 002-interactive-cli
user: Claude Code
command: /sp.implement @agent-cli-engineer Refactor the app.
labels: ["refactor", "interactive", "cli", "questionary"]
links:
  spec: specs/002-interactive-cli/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/todo.py
  - src/cli/commands.py
  - pyproject.toml
  - specs/002-interactive-cli/tasks.md
tests:
  - tests/integration/test_cli.py
  - tests/unit/test_manager.py
  - tests/unit/test_models.py
---

# Refactor App with Interactive CLI

## User Input
@agent-cli-engineer Refactor the app.
1. Run `uv add questionary`.
2. Rewrite `src/todo.py` to implement the `while True` loop and `questionary` logic.
3. Ensure `src/core/manager.py` remains unchanged (logic should be reusable).

## Response
Successfully implemented the interactive CLI refactoring:

1. **Dependencies**: Added questionary and pyfiglet via uv add commands
2. **Main entry point**: `src/todo.py` updated to detect interactive mode vs CLI mode
3. **Interactive logic**: Implemented `while True` loop with questionary in `src/cli/commands.py`
4. **Core logic preserved**: `src/core/manager.py` remains unchanged as requested

The application now supports both interactive and command-line modes:
- When run without arguments (`todo`), launches interactive menu with arrow key navigation
- When run with arguments (`todo add "task"`), uses traditional CLI commands
- All existing functionality preserved with backward compatibility

## Outcome
All tasks completed successfully. Interactive CLI mode is fully functional with:
- Rich banner display using pyfiglet
- Menu-driven interface with emoji icons
- Task selection workflows instead of manual ID input
- Confirmation dialogs for destructive operations
- Consistent rich color formatting
- Full backward compatibility with existing CLI commands