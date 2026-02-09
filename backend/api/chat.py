from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Dict, Any, Optional
from database import get_session
from src.db.chat_service import get_or_create_conversation, add_message, get_chat_history
from agent.runner import run_agent
from uuid import UUID
import logging
from pydantic import BaseModel # Added BaseModel import

logger = logging.getLogger(__name__)

# Define Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None # Optional conversation ID

router = APIRouter(tags=["chat"])

@router.post("/{user_id}/chat")
async def chat_endpoint(user_id: str, chat_request: ChatRequest):
    """
    Main chat endpoint that handles user messages and returns AI responses.

    Args:
        user_id: The ID of the user (from path)
        chat_request: The request body containing message and optional conversation_id

    Returns:
        Dictionary with conversation_id and response
    """
    message = chat_request.message
    conversation_id = chat_request.conversation_id

    logger.info(f"Received chat message for user {user_id}, conversation {conversation_id}: {message}")
    # Convert user_id to integer for database operations (assuming it's stored as int in db)
    try:
        user_id_int = int(user_id)
    except ValueError:
        logger.error(f"Invalid user_id format received: {user_id}")
        raise HTTPException(status_code=400, detail="Invalid user_id format")

    # Get database session
    with next(get_session()) as session:
        # Get or create conversation
        conversation = None
        if conversation_id:
            try:
                conv_uuid = UUID(conversation_id)
                # Check if conversation exists and belongs to user
                # We'll need to create a function to get conversation by ID and validate user
                from src.models.conversation import Conversation
                conversation = session.get(Conversation, conv_uuid)
                if not conversation or conversation.user_id != user_id:
                    logger.warning(f"Conversation {conversation_id} not found or does not belong to user {user_id}. Creating new conversation.")
                    # Create new conversation if not found or doesn't belong to user
                    conversation = get_or_create_conversation(session, user_id)
            except ValueError:
                logger.warning(f"Invalid conversation_id format received: {conversation_id}. Creating new conversation.")
                # Invalid UUID format, create new conversation
                conversation = get_or_create_conversation(session, user_id)
        else:
            logger.info(f"No conversation_id provided. Creating new conversation for user {user_id}.")
            conversation = get_or_create_conversation(session, user_id)
        
        logger.debug(f"Using conversation ID: {conversation.id}")

        # Add user message to conversation
        user_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role="user",
            content=message
        )
        logger.info(f"User message persisted for conversation {conversation.id}.")

        # Run the agent with the user's message
        try:
            response = await run_agent(
                user_id=user_id_int,
                message=message,
                conversation_id=str(conversation.id)
            )
            logger.info(f"Agent execution successful for conversation {conversation.id}.")
        except Exception as e:
            # Handle agent errors gracefully
            logger.exception(f"Agent encountered an error for conversation {conversation.id}.")
            response = f"Sorry, I encountered an error processing your request: {str(e)}"
            if isinstance(e, HTTPException):
                logger.error(f"HTTPException detail: {e.detail}")

        # Add assistant response to conversation
        assistant_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role="assistant",
            content=response
        )
        logger.info(f"Assistant response persisted for conversation {conversation.id}.")

        # Return the response
        return {
            "conversation_id": str(conversation.id),
            "response": response
        }

# Helper function to get conversation by ID and validate user
def get_conversation_by_id_and_user(session: Session, conversation_id: UUID, user_id: str):
    """
    Get conversation by ID and verify it belongs to the user.
    """
    from src.models.conversation import Conversation
    conversation = session.get(Conversation, conversation_id)
    if not conversation or conversation.user_id != user_id:
        return None
    return conversation