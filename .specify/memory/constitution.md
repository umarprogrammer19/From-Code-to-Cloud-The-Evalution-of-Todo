<!-- SYNC IMPACT REPORT:
Version change: N/A -> 1.0.0
Modified principles: None (new constitution)
Added sections: All sections
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

### I. Project Scope (CLI Only)
Terminal-based Todo App with local file storage only; No databases (SQL), No APIs (FastAPI), No AI integration allowed; Permitted: Local File I/O (JSON) only for persistence

### II. Tech Stack Standards
STRICTLY use `uv add` for dependencies; CLI Framework: `typer`; UI Framework: `rich` (for colors and tables); Data: `pydantic` (for validation); Testing: `pytest`

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
- CLI Framework: `typer` for command-line interface
- UI Framework: `rich` for colors and tables
- Data: `pydantic` for validation
- Testing: `pytest` for all tests
- Forbidden: No databases (SQL), No APIs (FastAPI), No AI integration yet

## Development Workflow

- src/core/: Business Logic (Models, Manager)
- src/cli/: Interface Logic (Typer commands)
- data/: Storage for tasks.json
- All new features must have corresponding tests
- Code reviews must verify compliance with architecture constraints
- Follow separation of concerns strictly

## Governance

All implementations must comply with this constitution; Architecture violations must be corrected; Dependencies must be added via `uv add` only; All file I/O must use JSON format; Changes to architecture require constitution amendments

**Version**: 1.0.0 | **Ratified**: 2025-12-12 | **Last Amended**: 2025-12-12