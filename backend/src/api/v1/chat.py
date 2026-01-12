"""API endpoints for chat functionality."""

import sys
from pathlib import Path

# Add the backend directory to the path to allow absolute imports
# This must be done before other imports
backend_dir = Path(__file__).resolve().parents[2]  # Go up 3 levels to reach backend root
sys.path.insert(0, str(backend_dir))

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List
import uuid
import json
from backend.src.models.conversation import Conversation, Message, RoleType
from backend.src.db.chat_service import get_or_create_conversation, add_message, get_chat_history
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
        from src.db.chat_service import get_user_conversations

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
<<<<<<< HEAD
        raise HTTPException(status_code=500, detail=f"Error retrieving user conversations: {str(e)}")


@router.post("/{user_id}/chat", response_model=dict)
def process_chat_message(
    user_id: str,
    message: str,
    conversation_id: str = None,
    session: Session = Depends(get_session)
):
    """
    Process a chat message through the MCP agent and persist the conversation.

    Args:
        user_id: The ID of the user
        message: The user's message
        conversation_id: The conversation ID (optional, creates new if not provided)

    Returns:
        Dictionary with conversation_id and response
    """
    try:
        # Get or create conversation
        conversation = get_or_create_conversation(session, user_id)
        conversation_id = str(conversation.id)

        # Persist user message to DB
        user_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role=RoleType.user,
            content=message
        )

        # Run the agent to get response
        agent_response = run_mcp_agent(
            user_id=user_id,
            message=message,
            conversation_id=conversation_id
        )

        # Persist assistant response to DB
        assistant_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role=RoleType.assistant,
            content=agent_response
        )

        # Return the response as specified in the requirements
        return {
            "conversation_id": conversation_id,
            "response": agent_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat message: {str(e)}")
=======
        raise HTTPException(status_code=500, detail=f"Error retrieving user conversations: {str(e)}")
>>>>>>> parent of 81c7706 (MCP Server Agent Success)
