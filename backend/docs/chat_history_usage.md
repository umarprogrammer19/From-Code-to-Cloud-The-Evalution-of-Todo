# Chat History Database Usage Guide

## Overview
This module provides database functionality for storing and retrieving chat conversations and messages. It uses SQLModel with Neon Serverless PostgreSQL as the database 

## Models

### Conversation
- `id`: UUID (Primary Key) - Unique identifier for the conversation
- `user_id`: String - Links the conversation to a specific user
- `created_at`: DateTime - When the conversation was created
- `updated_at`: DateTime - When the conversation was last updated

### Message
- `id`: UUID (Primary Key) - Unique identifier for the message
- `conversation_id`: UUID (Foreign Key) - Links to the conversation
- `role`: Enum (user, assistant, tool) - The sender type
- `content`: Text - The actual message content
- `tool_calls`: JSON (Optional) - Tool call information when applicable
- `created_at`: DateTime - When the message was created
- `updated_at`: DateTime - When the message was last updated

## Service Functions

### `get_or_create_conversation(session: Session, user_id: str) -> Conversation`
- Gets an existing conversation for the user or creates a new one
- Returns the conversation object

### `add_message(session: Session, conversation_id: UUID, role: RoleType, content: str, tool_calls: Optional[dict] = None) -> Message`
- Adds a message to the specified conversation
- Returns the created message object

### `get_chat_history(session: Session, conversation_id: UUID) -> List[Message]`
- Retrieves all messages for a conversation in chronological order
- Returns a list of message objects

### `get_user_conversations(session: Session, user_id: str) -> List[Conversation]`
- Retrieves all conversations for a specific user
- Returns a list of conversation objects

## API Endpoints

### POST `/conversations`
- Create or get existing conversation for a user
- Query parameter: `user_id`

### POST `/conversations/{conversation_id}/messages`
- Add a message to a conversation
- Path parameter: `conversation_id`
- Query parameters: `role`, `content`, `tool_calls`

### GET `/conversations/{conversation_id}/messages`
- Get chat history for a conversation
- Path parameter: `conversation_id`

### GET `/users/{user_id}/conversations`
- List all conversations for a user
- Path parameter: `user_id`

## Example Usage

```python
from sqlmodel import Session
from db.chat_service import get_or_create_conversation, add_message, get_chat_history

# Initialize database session
session = Session(engine)

# Get or create a conversation for a user
conversation = get_or_create_conversation(session, "user-123")

# Add messages to the conversation
user_msg = add_message(
    session=session,
    conversation_id=conversation.id,
    role="user",
    content="Hello, how can I help you today?"
)

assistant_msg = add_message(
    session=session,
    conversation_id=conversation.id,
    role="assistant",
    content="I can help you manage your tasks and answer questions."
)

# Retrieve the chat history
history = get_chat_history(session, conversation.id)
for msg in history:
    print(f"{msg.role}: {msg.content}")
```

## Error Handling

- Invalid UUID formats will result in 400 Bad Request errors
- Database errors will result in 500 Internal Server Error responses
- Proper logging is implemented for debugging and monitoring