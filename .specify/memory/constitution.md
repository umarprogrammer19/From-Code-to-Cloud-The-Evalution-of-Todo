<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 -> 1.1.0
Modified principles: I. Project Scope (CLI Only) -> I. Project Scope (Interactive TUI), II. Tech Stack Standards -> II. Tech Stack Standards (Enhanced)
Added sections: III. UX Standards
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->
# Todo App Constitution

## Core Principles

### I. Project Scope (Interactive TUI)
Build a **Menu-Driven Todo App** with local file storage only; **Interaction**: Users must select options via Arrow Keys (No typing commands like `add "task"`); **Loop**: The app runs continuously until "Exit" is selected; No databases (SQL), No APIs (FastAPI), No AI integration allowed; Permitted: Local File I/O (JSON) only for persistence

### II. Tech Stack Standards (Enhanced)
STRICTLY use `uv add` for dependencies; **Input**: `questionary` (Strictly for menus and text input); **Output**: `rich` (For colored tables and headers); **Core**: `typer` (Only for the entry point); **Data**: `pydantic` (Data validation); Testing: `pytest`

### III. Architecture (Non-Negotiable)
src/core/: Business Logic (Models, Manager); src/cli/: Interface Logic (Typer commands); data/: Storage for tasks.json; Strict separation of concerns between layers

### IV. Test-First Approach
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced; pytest for all test cases

### V. Data Management
Local JSON file storage only; tasks.json as the single source of truth; Proper serialization/deserialization with pydantic models; Data integrity and validation required

### VI. Code Quality Standards
All code must follow clean architecture principles; Models in src/core/ must be independent of CLI layer; Error handling for file I/O operations; Type hints required throughout

## Architecture Constraints

- Package Manager: STRICTLY use `uv add` for dependencies
- **Input Framework**: `questionary` for menus and text input
- **Output Framework**: `rich` for colors and tables
- **Core Framework**: `typer` only for entry point
- **Data Validation**: `pydantic` for data validation
- Testing: `pytest` for all tests
- Forbidden: No databases (SQL), No APIs (FastAPI), No AI integration yet

## UX Standards

- **Clear Screen**: Always clear the terminal (`console.clear()`) before showing the main menu
- **Feedback**: Show Green for success and Red for errors *before* returning to the menu
- **Continuous Loop**: The app runs continuously until "Exit" is selected
- **Arrow Key Navigation**: Users must select options via Arrow Keys only

## Development Workflow

- src/core/: Business Logic (Models, Manager)
- src/cli/: Interface Logic (Typer commands, questionary menus)
- data/: Storage for tasks.json
- All new features must have corresponding tests
- Code reviews must verify compliance with architecture constraints
- Follow separation of concerns strictly

## Governance

All implementations must comply with this constitution; Architecture violations must be corrected; Dependencies must be added via `uv add` only; All file I/O must use JSON format; Changes to architecture require constitution amendments

**Version**: 1.1.0 | **Ratified**: 2025-12-12 | **Last Amended**: 2025-12-13