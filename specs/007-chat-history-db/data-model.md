# Data Model: Chat History Database

## Entity: Conversation

### Fields
- **id** (UUID, Primary Key)
  - Type: `uuid.UUID` or `sqlmodel.GUID`
  - Constraint: Primary Key, Not Null, Unique
  - Purpose: Unique identifier for the conversation

- **user_id** (String)
  - Type: `str`
  - Constraint: Not Null, Indexed
  - Purpose: Links the conversation to a specific user

- **created_at** (Timestamp)
  - Type: `datetime.datetime`
  - Constraint: Not Null, Default: Current Timestamp
  - Purpose: Tracks when the conversation was created

- **updated_at** (Timestamp)
  - Type: `datetime.datetime`
  - Constraint: Not Null, Default: Current Timestamp
  - Purpose: Tracks when the conversation was last updated

### Relationships
- **messages** (One-to-Many)
  - Related Model: `Message`
  - Back Reference: `conversation`
  - Cascade: Delete (deleting conversation removes all messages)

## Entity: Message

### Fields
- **id** (UUID, Primary Key)
  - Type: `uuid.UUID` or `sqlmodel.GUID`
  - Constraint: Primary Key, Not Null, Unique
  - Purpose: Unique identifier for the message

- **conversation_id** (UUID, Foreign Key)
  - Type: `uuid.UUID` or `sqlmodel.GUID`
  - Constraint: Not Null, Foreign Key to `Conversation.id`, Indexed
  - Purpose: Links the message to a specific conversation

- **role** (String, Enum)
  - Type: `str` with validation
  - Constraint: Not Null, Check constraint for allowed values
  - Allowed Values: `user`, `assistant`, `tool`
  - Purpose: Identifies the sender/origin of the message

- **content** (Text)
  - Type: `str` (Text field)
  - Constraint: Not Null
  - Purpose: The actual content of the message

- **tool_calls** (JSON)
  - Type: `dict` or `typing.Optional[dict]`
  - Constraint: Nullable
  - Purpose: Stores tool call information when the message involves tool usage

- **created_at** (Timestamp)
  - Type: `datetime.datetime`
  - Constraint: Not Null, Default: Current Timestamp
  - Purpose: Tracks when the message was created

- **updated_at** (Timestamp)
  - Type: `datetime.datetime`
  - Constraint: Not Null, Default: Current Timestamp
  - Purpose: Tracks when the message was last updated

### Relationships
- **conversation** (Many-to-One)
  - Related Model: `Conversation`
  - Back Reference: `messages`

## Validation Rules

### Conversation
- user_id must be a valid identifier format
- created_at and updated_at must be valid datetime objects

### Message
- role must be one of: 'user', 'assistant', 'tool'
- conversation_id must reference an existing conversation
- content length should be reasonable (not empty)
- tool_calls must be valid JSON when present

## Indexes

### Conversation
- Index on `user_id` for efficient user-based queries

### Message
- Index on `conversation_id` for efficient conversation history retrieval
- Composite index on `(conversation_id, created_at)` for chronological message retrieval
- Index on `role` if role-based queries are common