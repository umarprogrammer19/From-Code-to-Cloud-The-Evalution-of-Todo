# Implementation Tasks: CLI Todo App

**Feature**: CLI Todo App
**Spec**: [specs/001-cli-todo-app/spec.md](specs/001-cli-todo-app/spec.md)
**Plan**: [specs/001-cli-todo-app/plan.md](specs/001-cli-todo-app/plan.md)

## Implementation Strategy

Implement the CLI Todo App following the architecture defined in the plan. The implementation will follow these phases:
1. Setup: Initialize project structure and dependencies
2. Foundational: Create core models and manager
3. User Stories: Implement CLI commands in priority order
4. Polish: Add error handling, tests, and documentation

## Dependencies

- User Story 2 (List) depends on User Story 1 (Add) for data to display
- All other stories are independent once the foundational components exist

## Parallel Execution Examples

- T005 [P] [US1] and T006 [P] [US2] can run in parallel after T004
- T007 [P] [US3] and T008 [P] [US4] can run in parallel after T004

## Phase 1: Setup

Initialize project structure and dependencies as per the implementation plan.

- [x] T001 Create src directory structure (src/core/, src/cli/, tests/)
- [x] T002 Create data directory and initialize tasks.json file
- [x] T003 Install dependencies: typer, rich, pydantic, pytest
- [x] T004 Create pyproject.toml with project configuration

## Phase 2: Foundational Components

Create the core models and manager that will be used by all CLI commands.

- [x] T005 [P] [US1] Create Task and TaskCollection Pydantic models in src/core/models.py
- [x] T006 [P] Create TaskManager class with CRUD operations in src/core/manager.py
- [x] T007 [P] Implement file I/O methods (save_to_file, load_from_file) in src/core/manager.py

## Phase 3: [US1] Add New Tasks

Implement the ability to add new tasks to the todo list with optional priority level.

- [x] T008 [P] [US1] Create add command in src/cli/commands.py
- [x] T009 [P] [US1] Implement validation for task title and priority parameters
- [x] T010 [P] [US1] Add success message in green for task creation
- [x] T011 [P] [US1] Add error handling for invalid inputs

## Phase 4: [US2] View Task List

Implement the ability to view all tasks in a formatted table.

- [x] T012 [P] [US2] Create list command in src/cli/commands.py
- [x] T013 [P] [US2] Implement rich table display with ID, Title, Priority, Status columns
- [x] T014 [P] [US2] Add appropriate message when task list is empty
- [x] T015 [P] [US2] Add error handling for file I/O failures

## Phase 5: [US3] Complete Tasks

Implement the ability to mark tasks as complete.

- [x] T016 [P] [US3] Create complete command in src/cli/commands.py
- [x] T017 [P] [US3] Implement task status update from Pending to Done
- [x] T018 [P] [US3] Add success message in green for completion
- [x] T019 [P] [US3] Add error handling for invalid task IDs

## Phase 6: [US4] Update and Delete Tasks

Implement the ability to update or delete tasks.

- [x] T020 [P] [US4] Create update command in src/cli/commands.py
- [x] T021 [P] [US4] Create delete command in src/cli/commands.py
- [x] T022 [P] [US4] Add success messages in green for update/delete operations
- [x] T023 [P] [US4] Add error handling for invalid task IDs

## Phase 7: Polish & Cross-Cutting Concerns

Final implementation touches including main entry point and comprehensive error handling.

- [x] T024 Create main application entry point in src/todo.py
- [x] T025 Implement consistent error messaging in red across all commands
- [x] T026 Add validation for all user inputs and edge cases
- [x] T027 Create basic unit tests for core models and manager
- [x] T028 Create basic integration tests for CLI commands
- [x] T029 Update README.md with usage instructions