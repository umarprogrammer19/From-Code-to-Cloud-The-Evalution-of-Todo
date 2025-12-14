# Data Model: Task Priority Backend

## Entity: Task

### Current Fields
- `id`: Integer - Primary key, auto-incrementing
- `title`: String - Task title (required)
- `description`: String - Task description (optional)
- `completed`: Boolean - Completion status (default: false)
- `user_id`: Integer - Foreign key linking to user (required for data isolation)
- `created_at`: DateTime - Creation timestamp (auto-generated)
- `updated_at`: DateTime - Last update timestamp (auto-generated)

### New Fields
- `priority`: String - Task priority level (low, medium, high, urgent) (default: "medium")

### Field Constraints
- `priority`: Must be one of ["low", "medium", "high", "urgent"]
- `user_id`: Foreign key relationship to user table for data isolation
- `title`: Required field, maximum length of 255 characters
- `description`: Optional, maximum length of 1000 characters

### Validation Rules
- Priority field must be validated against allowed values
- Task creation requires valid priority value or uses default
- Task updates can modify priority to any allowed value
- Filtering operations must validate priority parameter against allowed values

## Entity: User
- `id`: Integer - Primary key
- Other user fields remain unchanged as they already exist in the system

## Relationships
- Task belongs to User (one-to-many relationship)
- Each task is associated with exactly one user via user_id
- Users can have multiple tasks but cannot access tasks belonging to other users