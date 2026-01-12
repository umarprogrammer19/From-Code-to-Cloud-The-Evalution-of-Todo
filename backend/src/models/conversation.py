"""Conversation and Message models for chat history."""

from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum
from sqlalchemy import JSON


class RoleType(str, Enum):
    """Enum for message roles."""
    user = "user"
    assistant = "assistant"
    tool = "tool"


class Conversation(SQLModel, table=True):
    """Conversation model representing a logical grouping of messages."""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to messages
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class Message(SQLModel, table=True):
    """Message model representing individual exchanges within a conversation."""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(
        foreign_key="conversation.id",
        index=True,
        nullable=False
    )
    role: RoleType = Field(sa_column_kwargs={"server_default": "user"})
    content: str = Field(nullable=False)
    tool_calls: Optional[str] = Field(default=None)  # Store as JSON string for now
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to conversation
    conversation: Optional[Conversation] = Relationship(back_populates="messages")