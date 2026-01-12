# Quickstart: Chat History Database

## Setup

### Prerequisites
- Python 3.13+ installed
- uv package manager installed
- Neon Serverless PostgreSQL database configured

### Installation
1. Install SQLModel dependency:
   ```bash
   uv add sqlmodel
   ```

2. Ensure database connection is configured in the application settings

## Data Models

### Conversation Model
```python
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from typing import Optional, List

class Conversation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())

    # Relationship to messages
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        cascade_delete=True
    )
```

### Message Model
```python
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from typing import Optional

class Message(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(
        foreign_key="conversation.id",
        index=True
    )
    role: str = Field(regex="^(user|assistant|tool)$")
    content: str
    tool_calls: Optional[dict] = Field(default=None)
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())

    # Relationship to conversation
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
```

## Service Functions

### Get or Create Conversation
```python
from sqlmodel import Session, select
from backend.models import Conversation

def get_or_create_conversation(session: Session, user_id: str) -> Conversation:
    # Try to find existing conversation
    statement = select(Conversation).where(Conversation.user_id == user_id)
    conversation = session.exec(statement).first()

    if not conversation:
        # Create new conversation if none exists
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    return conversation
```

### Add Message to Conversation
```python
from sqlmodel import Session
from backend.models import Message

def add_message(
    session: Session,
    conversation_id: uuid.UUID,
    role: str,
    content: str,
    tool_calls: Optional[dict] = None
) -> Message:
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        tool_calls=tool_calls
    )

    session.add(message)
    session.commit()
    session.refresh(message)

    return message
```

### Get Chat History
```python
from sqlmodel import Session, select
from typing import List
from backend.models import Message

def get_chat_history(session: Session, conversation_id: uuid.UUID) -> List[Message]:
    statement = select(Message).where(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc())

    messages = session.exec(statement).all()
    return messages
```

## Usage Example

```python
from sqlmodel import create_engine, Session
from backend.db.chat_service import (
    get_or_create_conversation,
    add_message,
    get_chat_history
)

# Initialize database session
engine = create_engine("postgresql://...")
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

## Database Migration

After adding these models, run the database migration:

```bash
# Generate migration
alembic revision --autogenerate -m "Add Conversation and Message models"

# Apply migration
alembic upgrade head
```