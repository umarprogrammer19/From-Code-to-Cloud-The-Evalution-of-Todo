"""API endpoints for chat functionality."""

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List
import uuid
import json
from backend.models import Conversation, Message, RoleType
from backend.db.chat_service import get_or_create_conversation, add_message, get_chat_history
from backend.database import get_session


router = APIRouter()


@router.post("/conversations", response_model=dict)
def create_conversation(user_id: str, session: Session = Depends(get_session)):
    """Create or get existing conversation for a user."""
    try:
        conversation = get_or_create_conversation(session, user_id)

        return {
            "conversation_id": str(conversation.id),
            "user_id": conversation.user_id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating conversation: {str(e)}")


@router.post("/conversations/{conversation_id}/messages", response_model=dict)
def add_conversation_message(
    conversation_id: str,
    role: RoleType,
    content: str,
    tool_calls: dict = None,
    session: Session = Depends(get_session)
):
    """Add a message to a conversation."""
    try:
        # Validate conversation_id
        try:
            conv_uuid = uuid.UUID(conversation_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid conversation ID format")

        message = add_message(session, conv_uuid, role, content, tool_calls)

        # Parse tool_calls from JSON string for response
        tool_calls_response = json.loads(message.tool_calls) if message.tool_calls else None

        return {
            "message_id": str(message.id),
            "conversation_id": str(message.conversation_id),
            "role": message.role.value,
            "content": message.content,
            "tool_calls": tool_calls_response,
            "created_at": message.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding message: {str(e)}")


@router.get("/conversations/{conversation_id}/messages", response_model=dict)
def get_conversation_history(conversation_id: str, session: Session = Depends(get_session)):
    """Get chat history for a conversation."""
    try:
        # Validate conversation_id
        try:
            conv_uuid = uuid.UUID(conversation_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid conversation ID format")

        messages = get_chat_history(session, conv_uuid)

        return {
            "conversation_id": conversation_id,
            "messages": [
                {
                    "message_id": str(msg.id),
                    "role": msg.role.value,
                    "content": msg.content,
                    "tool_calls": json.loads(msg.tool_calls) if msg.tool_calls else None,
                    "created_at": msg.created_at.isoformat()
                }
                for msg in messages
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")


@router.get("/users/{user_id}/conversations", response_model=dict)
def list_user_conversations(user_id: str, session: Session = Depends(get_session)):
    """List all conversations for a user."""
    try:
        from backend.db.chat_service import get_user_conversations

        conversations = get_user_conversations(session, user_id)

        return {
            "user_id": user_id,
            "conversations": [
                {
                    "conversation_id": str(conv.id),
                    "user_id": conv.user_id,
                    "created_at": conv.created_at.isoformat(),
                    "updated_at": conv.updated_at.isoformat()
                }
                for conv in conversations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user conversations: {str(e)}")