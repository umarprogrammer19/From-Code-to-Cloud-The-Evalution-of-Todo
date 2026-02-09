"""API endpoints for chat functionality."""

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List, Optional
import uuid
import json
import logging # Added logging import

from ...models.conversation import Conversation, Message, RoleType
from ...db.chat_service import get_or_create_conversation, add_message, get_chat_history
from data.database import get_session
from agent.runner import run_agent


from pydantic import BaseModel # Added BaseModel import

logger = logging.getLogger(__name__) # Initialized logger

# Define Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[uuid.UUID] = None # Optional conversation ID (Use UUID type)


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


@router.get("/users/conversations", response_model=dict)
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
        raise HTTPException(status_code=500, detail=f"Error retrieving user conversations: {str(e)}")


@router.post("/chat", response_model=dict)
async def process_chat_message(
    user_id: int,
    chat_request: ChatRequest, # Use ChatRequest Pydantic model for request body
    session: Session = Depends(get_session)
):
    """
    Process a chat message through the MCP agent and persist the conversation.

    Args:
        user_id: The ID of the user (from path parameter)
        chat_request: The request body containing message and optional conversation_id

    Returns:
        Dictionary with conversation_id and response
    """
    message = chat_request.message
    conversation_id = chat_request.conversation_id

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

        # Call the MCP agent to process the message
        agent_response = await run_agent(
            user_id=user_id, # user_id is now int
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
        logger.exception(f"Error processing chat message for user {user_id}, conversation {conversation_id}:")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
