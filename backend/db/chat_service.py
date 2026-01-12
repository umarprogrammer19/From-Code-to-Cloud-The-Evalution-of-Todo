"""Service functions for chat operations."""

from sqlmodel import Session, select
from typing import List, Optional
from backend.models import Conversation, Message, RoleType
import uuid
import json


def get_or_create_conversation(session: Session, user_id: str) -> Conversation:
    """Get existing conversation for user or create a new one."""
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


def get_user_conversations(session: Session, user_id: str) -> List[Conversation]:
    """Get all conversations for a user."""
    statement = select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.created_at.desc())
    conversations = session.exec(statement).all()
    return conversations


def add_message(
    session: Session,
    conversation_id: uuid.UUID,
    role: RoleType,
    content: str,
    tool_calls: Optional[dict] = None
) -> Message:
    """Add a message to a conversation."""
    # Convert tool_calls dict to JSON string if provided
    tool_calls_str = json.dumps(tool_calls) if tool_calls is not None else None

    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        tool_calls=tool_calls_str
    )

    session.add(message)
    session.commit()
    session.refresh(message)

    return message


def get_chat_history(session: Session, conversation_id: uuid.UUID) -> List[Message]:
    """Get all messages for a conversation, ordered chronologically."""
    statement = select(Message).where(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc())

    messages = session.exec(statement).all()
    return messages