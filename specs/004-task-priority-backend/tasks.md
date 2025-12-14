---
description: "Task list for Task Priority Backend feature"
---

# Tasks: Task Priority Backend

**Input**: Design documents from `/specs/004-task-priority-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as requested in the feature specification.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `backend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create priority enum in `backend/src/models/task.py`
- [ ] T002 [P] Update Task model with priority field in `backend/src/models/task.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Update TaskCreate schema with priority field in `backend/src/schemas/task.py`
- [ ] T004 [P] Update TaskUpdate schema with priority field in `backend/src/schemas/task.py`
- [ ] T005 [P] Update TaskResponse schema with priority field in `backend/src/schemas/task.py`
- [ ] T006 Update task service with priority operations in `backend/src/services/task_service.py`
- [ ] T007 Update existing task endpoints to support priority in `backend/src/api/v1/tasks.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Task with Priority (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks with priority levels in their account with JWT validation

**Independent Test**: Can be fully tested by sending a POST request to `/api/{user_id}/tasks` with a valid JWT token and task data including a priority field, and verifying that the task is created in the database with the specified priority level.

### Tests for User Story 1
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Contract test for POST `/api/{user_id}/tasks` with priority in `backend/tests/contract/test_contracts/`
- [ ] T009 [P] [US1] Integration test for task creation with priority flow in `backend/tests/integration/test_api/`

### Implementation for User Story 1

- [ ] T010 [P] [US1] Update POST `/api/{user_id}/tasks` endpoint to handle priority in `backend/src/api/v1/tasks.py`
- [ ] T011 [US1] Add priority validation for task creation
- [ ] T012 [US1] Add logging for task creation with priority operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update Task Priority (Priority: P2)

**Goal**: Enable users to update the priority of their existing tasks with proper user data isolation

**Independent Test**: Can be fully tested by sending a PUT request to `/api/{user_id}/tasks/{id}` with a valid JWT token and updated priority data, verifying that the task priority is updated only if it belongs to the user.

### Tests for User Story 2
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US2] Contract test for PUT `/api/{user_id}/tasks/{id}` with priority in `backend/tests/contract/test_contracts/`
- [ ] T014 [P] [US2] Integration test for task priority update flow in `backend/tests/integration/test_api/`

### Implementation for User Story 2

- [ ] T015 [P] [US2] Update PUT `/api/{user_id}/tasks/{id}` endpoint to handle priority updates in `backend/src/api/v1/tasks.py`
- [ ] T016 [US2] Add priority validation for task updates
- [ ] T017 [US2] Integrate with User Story 1 components

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Filter Tasks by Priority (Priority: P3)

**Goal**: Enable users to retrieve their tasks filtered by priority level with proper ownership validation

**Independent Test**: Can be fully tested by sending a GET request to `/api/{user_id}/tasks` with a priority filter parameter and verifying that only tasks with the specified priority are returned.

### Tests for User Story 3
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US3] Contract test for GET `/api/{user_id}/tasks` with priority filter in `backend/tests/contract/test_contracts/`
- [ ] T019 [P] [US3] Integration test for task filtering by priority flow in `backend/tests/integration/test_api/`

### Implementation for User Story 3

- [ ] T020 [P] [US3] Update GET `/api/{user_id}/tasks` endpoint to support priority filtering in `backend/src/api/v1/tasks.py`
- [ ] T021 [US3] Add priority validation for task filtering
- [ ] T022 [US3] Integrate with User Story 1 and 2 components

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 [P] Update documentation in `backend/README.md`
- [ ] T024 Code cleanup and refactoring
- [ ] T025 [P] Additional unit tests in `backend/tests/unit/`
- [ ] T026 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, each user story can start in priority order
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories should be worked on sequentially in priority order

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