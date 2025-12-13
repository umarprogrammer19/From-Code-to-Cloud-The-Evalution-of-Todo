---
description: "Task list template for feature implementation"
---

# Tasks: Phase 2 Backend - Task Management API

**Input**: Design documents from `/specs/003-phase2-backend-tasks/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in `backend/` directory
- [X] T002 Initialize Python project with FastAPI, SQLModel, PyJWT dependencies using `uv add fastapi uvicorn sqlmodel pyjwt`
- [X] T003 [P] Configure .gitignore with Python-specific patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T004 Setup database connection utilities in `backend/data/database.py`
- [X] T005 [P] Implement JWT validation dependency in `backend/src/services/auth.py`
- [X] T006 [P] Setup API routing and middleware structure in `backend/src/api/deps.py`
- [X] T007 Create base models/entities that all stories depend on in `backend/src/models/base.py`
- [X] T008 Configure error handling and logging infrastructure in `backend/src/config/settings.py`
- [X] T009 Setup environment configuration management in `backend/src/config/settings.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks in their account with JWT validation

**Independent Test**: Can be fully tested by sending a POST request to `/api/{user_id}/tasks` with a valid JWT token and task data, and verifying that the task is created in the database for the correct user.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Contract test for POST `/api/{user_id}/tasks` in `backend/tests/contract/test_contracts/`
- [X] T011 [P] [US1] Integration test for task creation flow in `backend/tests/integration/test_api/`

### Implementation for User Story 1

- [X] T012 [P] [US1] Create Task model in `backend/src/models/task.py`
- [X] T013 [P] [US1] Create Task schemas (create, update, response) in `backend/src/schemas/task.py`
- [X] T014 [US1] Implement TaskService in `backend/src/services/task_service.py` (depends on T012)
- [X] T015 [US1] Implement POST `/api/{user_id}/tasks` endpoint in `backend/src/api/v1/tasks.py`
- [X] T016 [US1] Add validation and error handling for task creation
- [X] T017 [US1] Add logging for task creation operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Retrieve Tasks (Priority: P1)

**Goal**: Enable users to retrieve all their tasks with proper user data isolation

**Independent Test**: Can be fully tested by sending a GET request to `/api/{user_id}/tasks` with a valid JWT token and verifying that only tasks belonging to that user are returned.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T018 [P] [US2] Contract test for GET `/api/{user_id}/tasks` in `backend/tests/contract/test_contracts/`
- [X] T019 [P] [US2] Integration test for task retrieval flow in `backend/tests/integration/test_api/`

### Implementation for User Story 2

- [X] T020 [P] [US2] Implement task retrieval methods in `backend/src/services/task_service.py`
- [X] T021 [US2] Implement GET `/api/{user_id}/tasks` endpoint in `backend/src/api/v1/tasks.py`
- [X] T022 [US2] Add user_id validation for task retrieval
- [X] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task (Priority: P2)

**Goal**: Enable users to update their existing tasks with proper ownership validation

**Independent Test**: Can be fully tested by sending a PUT request to `/api/{user_id}/tasks/{id}` with a valid JWT token and updated task data, verifying that the task is updated only if it belongs to the user.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T024 [P] [US3] Contract test for PUT `/api/{user_id}/tasks/{id}` in `backend/tests/contract/test_contracts/`
- [X] T025 [P] [US3] Integration test for task update flow in `backend/tests/integration/test_api/`

### Implementation for User Story 3

- [X] T026 [P] [US3] Add update methods to TaskService in `backend/src/services/task_service.py`
- [X] T027 [US3] Implement PUT `/api/{user_id}/tasks/{id}` endpoint in `backend/src/api/v1/tasks.py`
- [X] T028 [US3] Implement task ownership validation for updates

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Delete Task (Priority: P2)

**Goal**: Enable users to delete their tasks with proper ownership validation

**Independent Test**: Can be fully tested by sending a DELETE request to `/api/{user_id}/tasks/{id}` with a valid JWT token, verifying that the task is deleted only if it belongs to the user.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T029 [P] [US4] Contract test for DELETE `/api/{user_id}/tasks/{id}` in `backend/tests/contract/test_contracts/`
- [X] T030 [P] [US4] Integration test for task deletion flow in `backend/tests/integration/test_api/`

### Implementation for User Story 4

- [X] T031 [P] [US4] Add delete methods to TaskService in `backend/src/services/task_service.py`
- [X] T032 [US4] Implement DELETE `/api/{user_id}/tasks/{id}` endpoint in `backend/src/api/v1/tasks.py`
- [X] T033 [US4] Implement task ownership validation for deletion

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Documentation updates in `backend/README.md`
- [X] T035 Code cleanup and refactoring
- [X] T036 Performance optimization across all stories
- [X] T037 [P] Additional unit tests in `backend/tests/unit/`
- [X] T038 Security hardening
- [X] T039 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/{user_id}/tasks in backend/tests/contract/test_contracts/"
Task: "Integration test for task creation flow in backend/tests/integration/test_api/"

# Launch all models for User Story 1 together:
Task: "Create Task model in backend/src/models/task.py"
Task: "Create Task schemas (create, update, response) in backend/src/schemas/task.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence