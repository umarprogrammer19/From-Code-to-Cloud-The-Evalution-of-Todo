# Feature Specification: Phase 2 Backend - Task Management API

**Feature Branch**: `003-phase2-backend-tasks`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "@.claude\agents\fullstack-architect.md I want to build the Phase 2 Backend.

**Requirements**:
1. **Folder**: Make `backend/` folder for backend and do all the work here.
2. **Database**: Use Neon Serverless Postgres SQL DB As Database And Use SQL Model ORM (ask env if needed now).
3. **Auth**: Implement the JWT Verification dependency (not write auth code in backend we will do it in nextjs api routes).
4. **Endpoints**:
   - `POST /api/{user_id}/tasks`
   - `GET /api/{user_id}/tasks`
   - `PUT /api/{user_id}/tasks/{id}`
   - `DELETE /api/{user_id}/tasks/{id}`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task (Priority: P1)

As a user, I want to create new tasks in my account so that I can track my to-dos and responsibilities. The system should validate my JWT token to ensure I can only create tasks for my own user account.

**Why this priority**: Creating tasks is the fundamental capability that enables all other task management features. Without this, users cannot use the system.

**Independent Test**: Can be fully tested by sending a POST request to `/api/{user_id}/tasks` with a valid JWT token and task data, and verifying that the task is created in the database for the correct user.

**Acceptance Scenarios**:

1. **Given** user has a valid JWT token with correct user_id, **When** user sends POST request to `/api/{user_id}/tasks` with valid task data, **Then** task is created in the database and returned with 201 status
2. **Given** user has invalid or expired JWT token, **When** user sends POST request to `/api/{user_id}/tasks`, **Then** system returns 401 Unauthorized error

---

### User Story 2 - Retrieve Tasks (Priority: P1)

As a user, I want to retrieve all my tasks so that I can view and manage them. The system should ensure I can only access tasks that belong to my user account.

**Why this priority**: Viewing tasks is equally important as creating them - users need to see what they've created to manage their work effectively.

**Independent Test**: Can be fully tested by sending a GET request to `/api/{user_id}/tasks` with a valid JWT token and verifying that only tasks belonging to that user are returned.

**Acceptance Scenarios**:

1. **Given** user has a valid JWT token with correct user_id, **When** user sends GET request to `/api/{user_id}/tasks`, **Then** system returns all tasks for that user with 200 status
2. **Given** user has invalid JWT token, **When** user sends GET request to `/api/{user_id}/tasks`, **Then** system returns 401 Unauthorized error

---

### User Story 3 - Update Task (Priority: P2)

As a user, I want to update my existing tasks so that I can modify their details or mark them as completed. The system should ensure I can only update tasks that belong to my user account.

**Why this priority**: Task modification is important for ongoing task management, but less critical than creation and retrieval.

**Independent Test**: Can be fully tested by sending a PUT request to `/api/{user_id}/tasks/{id}` with a valid JWT token and updated task data, verifying that the task is updated only if it belongs to the user.

**Acceptance Scenarios**:

1. **Given** user has a valid JWT token and owns the task with specified id, **When** user sends PUT request to `/api/{user_id}/tasks/{id}` with updated task data, **Then** task is updated and returned with 200 status
2. **Given** user tries to update a task that doesn't belong to them, **When** user sends PUT request to `/api/{user_id}/tasks/{id}`, **Then** system returns 403 Forbidden error

---

### User Story 4 - Delete Task (Priority: P2)

As a user, I want to delete my tasks when they are completed or no longer needed so that I can keep my task list clean and organized.

**Why this priority**: Task deletion is important for maintaining a clean task list, but less critical than the core CRUD operations.

**Independent Test**: Can be fully tested by sending a DELETE request to `/api/{user_id}/tasks/{id}` with a valid JWT token, verifying that the task is deleted only if it belongs to the user.

**Acceptance Scenarios**:

1. **Given** user has a valid JWT token and owns the task with specified id, **When** user sends DELETE request to `/api/{user_id}/tasks/{id}`, **Then** task is deleted and system returns 204 status
2. **Given** user tries to delete a task that doesn't belong to them, **When** user sends DELETE request to `/api/{user_id}/tasks/{id}`, **Then** system returns 403 Forbidden error

---

### Edge Cases

- What happens when a user tries to access tasks for a different user_id than in their JWT token?
- How does system handle database connection failures during API operations?
- What happens when a user tries to update or delete a non-existent task?
- How does system handle malformed JWT tokens?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST validate JWT tokens from Authorization header for all API endpoints
- **FR-002**: System MUST ensure user_id in URL path matches the user_id extracted from JWT token
- **FR-003**: System MUST store task data in Neon Serverless PostgreSQL database using SQLModel ORM
- **FR-004**: System MUST allow users to create tasks via POST `/api/{user_id}/tasks` endpoint
- **FR-005**: System MUST allow users to retrieve their tasks via GET `/api/{user_id}/tasks` endpoint
- **FR-006**: System MUST allow users to update their tasks via PUT `/api/{user_id}/tasks/{id}` endpoint
- **FR-007**: System MUST allow users to delete their tasks via DELETE `/api/{user_id}/tasks/{id}` endpoint
- **FR-008**: System MUST ensure users can only access tasks that belong to their own user account
- **FR-009**: System MUST return appropriate HTTP status codes for all operations
- **FR-010**: System MUST return properly formatted error messages for failed operations

### Key Entities *(include if feature involves data)*

- **Task**: Represents a user's task with attributes like title, description, completion status, creation timestamp, and update timestamp
- **User**: Represents a system user identified by user_id that is extracted from JWT token

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create, read, update, and delete tasks through the API endpoints with 99% success rate
- **SC-002**: API endpoints respond within 500ms for 95% of requests under normal load conditions
- **SC-003**: 100% of requests properly validate JWT tokens and enforce user data isolation
- **SC-004**: System handles concurrent access by multiple users without data leakage between accounts
- **SC-005**: Error responses provide clear, actionable information to help users understand and resolve issues
