"""Tests for chat functionality."""

import pytest
from sqlmodel import Session, create_engine, SQLModel
from unittest.mock import Mock, patch
from src.models.conversation import Conversation, Message, RoleType
from src.db.chat_service import get_or_create_conversation, add_message, get_chat_history, get_user_conversations
import uuid


# Test using an in-memory SQLite database for testing
@pytest.fixture(name="engine")
def fixture_engine():
    engine = create_engine("sqlite:///:memory:", echo=True)
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture(name="session")
def fixture_session(engine):
    with Session(engine) as session:
        yield session


def test_conversation_model():
    """Test Conversation model structure."""
    # Test creating a conversation instance
    user_id = "test_user"
    conversation = Conversation(user_id=user_id)

    assert conversation.user_id == user_id
    assert conversation.id is not None
    assert conversation.created_at is not None
    assert conversation.updated_at is not None


def test_message_model():
    """Test Message model structure."""
    import uuid

    conversation_id = uuid.uuid4()
    message = Message(
        conversation_id=conversation_id,
        role=RoleType.user,
        content="Test message"
    )

    assert message.conversation_id == conversation_id
    assert message.role == RoleType.user
    assert message.content == "Test message"
    assert message.created_at is not None
    assert message.updated_at is not None


def test_get_or_create_conversation(session):
    """Test getting or creating a conversation."""
    user_id = "test_user_123"

    # First call should create a new conversation
    conversation1 = get_or_create_conversation(session, user_id)
    assert conversation1.user_id == user_id

    # Second call with same user_id should return the same conversation
    conversation2 = get_or_create_conversation(session, user_id)
    assert conversation1.id == conversation2.id
    assert conversation2.user_id == user_id


def test_add_message(session):
    """Test adding a message to a conversation."""
    # Create a conversation first
    user_id = "test_user_msg"
    conversation = get_or_create_conversation(session, user_id)

    # Add a message to the conversation
    message = add_message(
        session=session,
        conversation_id=conversation.id,
        role=RoleType.user,
        content="Hello, world!",
        tool_calls=None
    )

    assert message.conversation_id == conversation.id
    assert message.role == RoleType.user
    assert message.content == "Hello, world!"
    assert message.tool_calls is None


def test_get_chat_history(session):
    """Test retrieving chat history."""
    # Create a conversation
    user_id = "test_user_history"
    conversation = get_or_create_conversation(session, user_id)

    # Add multiple messages
    add_message(session, conversation.id, RoleType.user, "First message")
    add_message(session, conversation.id, RoleType.assistant, "Second message")
    add_message(session, conversation.id, RoleType.tool, "Third message")

    # Retrieve the history
    history = get_chat_history(session, conversation.id)

    assert len(history) == 3
    assert history[0].content == "First message"
    assert history[0].role == RoleType.user
    assert history[1].content == "Second message"
    assert history[1].role == RoleType.assistant
    assert history[2].content == "Third message"
    assert history[2].role == RoleType.tool


def test_get_user_conversations(session):
    """Test getting all conversations for a user."""
    user_id = "test_multiple_conv"

    # Create multiple conversations for the same user
    conv1 = get_or_create_conversation(session, user_id)
    # Add a delay or slight difference to test ordering if needed

    # Add messages to first conversation
    add_message(session, conv1.id, RoleType.user, "Message in first conversation")

    # Get all conversations for the user
    conversations = get_user_conversations(session, user_id)

    assert len(conversations) >= 1
    assert any(conv.id == conv1.id for conv in conversations)
    assert all(conv.user_id == user_id for conv in conversations)


def test_get_user_conversations_multiple_users(session):
    """Test that conversations are properly isolated between users."""
    user1_id = "test_user_1"
    user2_id = "test_user_2"

    # Create conversations for both users
    # Note: get_or_create_conversation creates one per user, so we need different user IDs for multiple conversations
    conv1_user1 = get_or_create_conversation(session, user1_id)
    conv2_user1 = get_or_create_conversation(session, "test_user_1_different")  # This will create a new conversation
    conv1_user2 = get_or_create_conversation(session, user2_id)

    # Get conversations for each user
    user1_conversations = get_user_conversations(session, user1_id)
    user1_conversations_2 = get_user_conversations(session, "test_user_1_different")
    user2_conversations = get_user_conversations(session, user2_id)

    # Verify isolation
    assert len(user1_conversations) == 1  # Only one conversation for user1_id
    assert len(user1_conversations_2) == 1  # Only one conversation for test_user_1_different
    assert len(user2_conversations) == 1  # Only one conversation for user2_id

    # Test that different users have separate conversations
    all_user1_conv_ids = [conv.id for conv in get_user_conversations(session, user1_id)]
    all_user2_conv_ids = [conv.id for conv in get_user_conversations(session, user2_id)]
    all_user1_2_conv_ids = [conv.id for conv in get_user_conversations(session, "test_user_1_different")]

    # Verify no cross-contamination between users
    assert len(set(all_user1_conv_ids) & set(all_user2_conv_ids)) == 0  # No overlap between user1 and user2
    assert len(set(all_user1_2_conv_ids) & set(all_user2_conv_ids)) == 0  # No overlap between user1_2 and user2


def test_message_roles_validation():
    """Test that message roles are properly validated."""
    import uuid

    # Test that all valid roles can be created
    for role in [RoleType.user, RoleType.assistant, RoleType.tool]:
        message = Message(
            conversation_id=uuid.uuid4(),
            role=role,
            content=f"Test message with {role} role"
        )
        assert message.role == role


def test_tool_calls_field(session):
    """Test that tool_calls field works correctly."""
    import json
    user_id = "test_tool_calls"
    conversation = get_or_create_conversation(session, user_id)

    # Add a message with tool calls
    tool_call_data = {
        "function": {"name": "get_weather", "arguments": '{"location": "New York"}'},
        "id": "call_123",
        "type": "function"
    }

    message_with_tools = add_message(
        session=session,
        conversation_id=conversation.id,
        role=RoleType.tool,
        content="Weather information",
        tool_calls=tool_call_data
    )

    # The tool_calls are stored as JSON string, so we need to compare the parsed version
    assert json.loads(message_with_tools.tool_calls) == tool_call_data

    # Add a message without tool calls
    message_without_tools = add_message(
        session=session,
        conversation_id=conversation.id,
        role=RoleType.user,
        content="What's the weather?",
        tool_calls=None
    )

    assert message_without_tools.tool_calls is None