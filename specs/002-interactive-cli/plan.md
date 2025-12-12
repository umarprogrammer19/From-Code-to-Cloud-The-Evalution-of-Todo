# Implementation Plan: Refactor src/todo.py for Interactive CLI Mode

**Branch**: `002-interactive-cli` | **Date**: 2025-12-13 | **Spec**: [specs/002-interactive-cli/spec.md](specs/002-interactive-cli/spec.md)
**Input**: Feature specification from `/specs/002-interactive-cli/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the refactoring of `src/todo.py` to implement an interactive CLI mode. The application will support both traditional command-line interface (when arguments are provided) and an interactive menu-driven interface (when run without arguments). The implementation will use `questionary` for interactive prompts and `rich.figlet` for banner display.

## Technical Context

**Language/Version**: Python 3.13
**Primary Dependencies**: typer (CLI framework), rich (UI formatting), pydantic (data validation), questionary (interactive prompts), pyfiglet (banner display)
**Storage**: Local JSON file (data/tasks.json)
**Testing**: pytest for all test cases
**Target Platform**: Cross-platform terminal application (Windows, macOS, Linux)
**Project Type**: Single terminal application
**Performance Goals**: Sub-second response time for all operations
**Constraints**: Must maintain backward compatibility with existing CLI commands
**Scale/Scope**: Single-user terminal application with local storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Project Scope**: Terminal-based Todo App with local file storage only - COMPLIES
- ✅ **Tech Stack Standards**: Using typer, rich, pydantic, pytest - COMPLIES
- ✅ **Architecture**: src/core/ for business logic, src/cli/ for interface logic - COMPLIES
- ✅ **Test-First Approach**: All new features will have corresponding tests - COMPLIES
- ✅ **Data Management**: Using local JSON file storage with pydantic models - COMPLIES
- ✅ **Code Quality**: Clean architecture with separation of concerns - COMPLIES
- ✅ **Dependencies**: Using uv add for dependencies - COMPLIES (dependencies already added via pyproject.toml)

## Project Structure

### Documentation (this feature)

```text
specs/002-interactive-cli/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── core/
│   ├── models.py        # Pydantic models for Task, TaskCollection, enums
│   └── manager.py       # TaskManager with CRUD operations
├── cli/
│   ├── commands.py      # Typer app with interactive mode implementation
│   └── __init__.py
└── todo.py             # Main entry point with mode detection logic

data/
└── tasks.json          # JSON file for task persistence

tests/
├── unit/
│   ├── test_models.py
│   └── test_manager.py
└── integration/
    └── test_cli.py

pyproject.toml          # Project dependencies and configuration
```

**Structure Decision**: Single terminal application structure with proper separation of concerns between core business logic and CLI interface. The `src/todo.py` file serves as the main entry point that determines whether to run in interactive or command-line mode based on arguments.

## Phase 1 Deliverables Summary

- ✅ **research.md**: Created with analysis of technical decisions
- ✅ **data-model.md**: Created with entity definitions and relationships
- ✅ **quickstart.md**: Created with setup and usage instructions
- ✅ **contracts/**: Created with CLI API contract documentation
- ✅ **Agent context updated**: Updated CLAUDE.md with new technologies

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
