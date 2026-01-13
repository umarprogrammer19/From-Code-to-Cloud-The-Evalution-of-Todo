"""Integration test for the complete chat history functionality."""

from sqlmodel import Session, create_engine, SQLModel
from src.models.conversation import Conversation, Message, RoleType
from src.db.chat_service import get_or_create_conversation, add_message, get_chat_history, get_user_conversations


def test_complete_chat_flow():
    """Test the complete chat history flow."""
    # Create an in-memory database for testing
    engine = create_engine("sqlite:///:memory:", echo=True)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Test User Story 1: Persistent Chat Conversations
        user_id = "integration_test_user"

        # Create/get a conversation
        conversation = get_or_create_conversation(session, user_id)
        assert conversation.user_id == user_id
        assert conversation.id is not None

        # Add several messages to the conversation
        user_msg = add_message(
            session, conversation.id, RoleType.user, "Hello, how are you?"
        )
        assistant_msg = add_message(
            session, conversation.id, RoleType.assistant, "I'm doing well, thank you!"
        )
        tool_msg = add_message(
            session,
            conversation.id,
            RoleType.tool,
            "Weather information retrieved",
            {"function": {"name": "get_weather", "arguments": '{"location": "New York"}'}}
        )

        # Verify messages were added correctly
        assert user_msg.role == RoleType.user
        assert user_msg.content == "Hello, how are you?"
        assert assistant_msg.role == RoleType.assistant
        assert tool_msg.role == RoleType.tool

        # Retrieve and verify chat history
        history = get_chat_history(session, conversation.id)
        assert len(history) == 3
        assert history[0].content == "Hello, how are you?"
        assert history[1].content == "I'm doing well, thank you!"
        assert history[2].content == "Weather information retrieved"

        # Test User Story 2: Conversation Management
        # Create another conversation for the same user (with a different ID pattern)
        another_user_id = f"{user_id}_another"
        another_conversation = get_or_create_conversation(session, another_user_id)

        # Add a message to the second conversation
        add_message(
            session, another_conversation.id, RoleType.user, "Message in second conversation"
        )

        # Get all conversations for the original user
        user_conversations = get_user_conversations(session, user_id)
        another_user_conversations = get_user_conversations(session, another_user_id)

        # Verify conversation isolation
        assert len(user_conversations) == 1
        assert len(another_user_conversations) == 1
        assert user_conversations[0].id != another_user_conversations[0].id

        # Verify each conversation has correct messages
        original_history = get_chat_history(session, conversation.id)
        another_history = get_chat_history(session, another_conversation.id)

        assert len(original_history) == 3
        assert len(another_history) == 1
        assert another_history[0].content == "Message in second conversation"

        # Test User Story 3: Message Storage and Retrieval
        # Verify different message types are stored correctly
        for msg in history:
            assert msg.role in [RoleType.user, RoleType.assistant, RoleType.tool]
            assert isinstance(msg.content, str)
            assert msg.conversation_id == conversation.id

        print("✅ All integration tests passed!")


if __name__ == "__main__":
    test_complete_chat_flow()