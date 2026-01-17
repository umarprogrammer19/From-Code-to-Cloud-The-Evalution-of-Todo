#!/usr/bin/env python3
"""
Simple validation script to ensure the chat functionality works correctly.
"""

from src.models.conversation import Conversation, Message, RoleType
from src.db.chat_service import get_or_create_conversation, add_message, get_chat_history, get_user_conversations
from sqlmodel import create_engine, SQLModel, Session
import uuid


def validate_chat_models():
    """Validate that the models work correctly."""
    print("🔍 Validating models...")

    # Test creating a conversation
    conversation = Conversation(user_id="test_user")
    assert conversation.user_id == "test_user"
    assert conversation.id is not None
    print("✅ Conversation model works correctly")

    message = Message(
        conversation_id=uuid.uuid4(),
        role=RoleType.user,
        content="Test message"
    )
    assert message.role == RoleType.user
    assert message.content == "Test message"
    print("✅ Message model works correctly")

    # Test role enum
    assert RoleType.user == "user"
    assert RoleType.assistant == "assistant"
    assert RoleType.tool == "tool"
    print("✅ RoleType enum works correctly")


def validate_database_operations():
    """Validate database operations with in-memory SQLite."""
    print("\n🔍 Validating database operations...")

    # Create in-memory database
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Test creating/getting conversation
        user_id = "validation_test_user"
        conv1 = get_or_create_conversation(session, user_id)
        conv2 = get_or_create_conversation(session, user_id)

        # Should return the same conversation
        assert conv1.id == conv2.id
        assert conv1.user_id == user_id
        print("✅ get_or_create_conversation works correctly")

        # Test adding messages
        msg1 = add_message(session, conv1.id, RoleType.user, "Hello")
        msg2 = add_message(session, conv1.id, RoleType.assistant, "Hi there!")

        assert msg1.content == "Hello"
        assert msg2.content == "Hi there!"
        print("✅ add_message works correctly")

        # Test retrieving history
        history = get_chat_history(session, conv1.id)
        assert len(history) == 2
        assert history[0].content == "Hello"
        assert history[1].content == "Hi there!"
        print("✅ get_chat_history works correctly")

        # Test user conversations
        user_convs = get_user_conversations(session, user_id)
        assert len(user_convs) == 1
        assert user_convs[0].id == conv1.id
        print("✅ get_user_conversations works correctly")


def validate_api_endpoints():
    """Validate that API endpoints can be imported without conflicts."""
    print("\n🔍 Validating API endpoints...")

    # Just try to import to make sure there are no import errors
    from src.api.v1.chat import router
    assert router is not None
    print("✅ API endpoints import successfully")


if __name__ == "__main__":
    print("🧪 Running validation tests for chat history functionality...\n")

    try:
        validate_chat_models()
        validate_database_operations()
        validate_api_endpoints()

        print("\n🎉 All validation tests passed!")
        print("✅ Chat history functionality is working correctly")
        print("📁 Files are properly organized in the src directory structure")
        print("🔄 Imports are correctly updated to use the new structure")

    except Exception as e:
        print(f"\n❌ Validation failed: {str(e)}")
        raise