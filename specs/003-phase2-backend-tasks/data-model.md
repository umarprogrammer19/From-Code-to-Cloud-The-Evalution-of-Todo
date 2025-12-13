# Data Model: Phase 2 Backend - Task Management API

## Entity: Task

### Fields
- **id**: Integer (Primary Key, Auto-increment)
- **title**: String (Required, max length 255)
- **description**: String (Optional, max length 1000)
- **completed**: Boolean (Default: false)
- **user_id**: Integer (Foreign Key, Required) - references user identifier from JWT
- **created_at**: DateTime (Auto-generated, Required)
- **updated_at**: DateTime (Auto-generated and updated, Required)

### Relationships
- Each Task belongs to exactly one User (identified by user_id from JWT)

### Validation Rules
- Title must not be empty or exceed 255 characters
- User_id must match the user_id extracted from the JWT token
- Completed field can only be updated by the task owner
- Task can only be read/modified by the user who owns it (enforced by user_id check)

### State Transitions
- A task is created with completed=false
- A task can transition from completed=false to completed=true
- A task can transition from completed=true to completed=false
- A task can be deleted by its owner

## Entity: User (Reference)

### Fields
- **user_id**: Integer (Primary identifier extracted from JWT token)
- Note: User data is managed by Better Auth on the frontend; backend only validates user_id from JWT

### Constraints
- All API operations must validate that the user_id in the JWT token matches the user_id in the URL path and database record
- Users can only access/modify their own tasks
- No direct user entity management in backend (handled by Better Auth)