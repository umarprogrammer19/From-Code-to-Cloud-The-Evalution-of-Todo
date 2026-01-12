# Data Model: MCP Agent Backend

## Entities

### Task Entity
Existing entity from the current system, used by MCP tools for task management operations.

**Fields:**
- `id` (int, primary key): Unique identifier for the task
- `title` (str): Task title (max 255 chars)
- `description` (str, optional): Detailed task description (max 1000 chars)
- `completed` (bool): Whether the task is completed (default: false)
- `priority` (PriorityLevel): Task priority (low, medium, high, urgent) (default: medium)
- `user_id` (int): Foreign key reference to user who owns the task
- `created_at` (datetime): Timestamp when task was created
- `updated_at` (datetime): Timestamp when task was last updated

**Relationships:**
- Belongs to a User (many-to-one)

### Conversation Entity
Existing entity for storing conversation history between user and AI assistant.

**Fields:**
- `id` (UUID): Unique identifier for the conversation
- `user_id` (str): Identifier for the user who owns the conversation
- `created_at` (datetime): Timestamp when conversation was created
- `updated_at` (datetime): Timestamp when conversation was last updated

**Relationships:**
- Has many Messages (one-to-many)

### Message Entity
Existing entity for storing individual messages within conversations.

**Fields:**
- `id` (UUID): Unique identifier for the message
- `conversation_id` (UUID): Foreign key reference to parent conversation
- `role` (RoleType): Message role (user, assistant, tool)
- `content` (str): The actual message content
- `tool_calls` (str, optional): JSON string representation of tool calls made
- `created_at` (datetime): Timestamp when message was created
- `updated_at` (datetime): Timestamp when message was last updated

**Relationships:**
- Belongs to a Conversation (many-to-one)

## Validation Rules

### Task Validation
- Title must be between 1 and 255 characters
- Description must be between 0 and 1000 characters if provided
- Priority must be one of the allowed values (low, medium, high, urgent)
- User ID must correspond to an existing user
- Completed status must be boolean

### Conversation Validation
- User ID must be provided and non-empty
- User ID must correspond to an existing user
- Created and updated timestamps are automatically managed

### Message Validation
- Content must be provided and non-empty
- Role must be one of the allowed values (user, assistant, tool)
- Conversation ID must correspond to an existing conversation
- Created and updated timestamps are automatically managed

## State Transitions

### Task State Transitions
- New task: `completed` starts as `false`
- Task completion: `completed` changes from `false` to `true`
- Task reactivation: `completed` changes from `true` to `false` (via update)
- Task deletion: record is removed from database

### Message State Transitions
- New message: created with initial content and role
- Message update: content or metadata can be modified (though typically immutable)
- Message deletion: only happens when entire conversation is deleted (cascade)