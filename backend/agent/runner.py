"""
AI Agent Runner for MCP Task Management

This module implements the OpenAI agent runner that accepts user_id, message, and conversation_id,
uses MCP tools to process the message, and returns a final text response.
"""

from typing import Dict, Optional
from agents import Agent, Runner, function_tool
import os
import sys
import importlib.util
from pathlib import Path

# Dynamically import the tools module
tools_module_path = Path(__file__).parent.parent / "mcp" / "tools.py"
spec = importlib.util.spec_from_file_location("tools", tools_module_path)
tools_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tools_module)

# Import the functions
add_task = tools_module.add_task
list_tasks = tools_module.list_tasks
complete_task = tools_module.complete_task
delete_task = tools_module.delete_task
update_task = tools_module.update_task


class MCPTaskAgent:
    """
    MCP Task Management Agent that uses OpenAI Agents SDK to process natural language
    and execute task management operations.
    """

    def __init__(self):
        """
        Initialize the MCP Task Agent with OpenAI Agents SDK and tools.
        """
        # Initialize API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

        # Set the API key
        os.environ["OPENAI_API_KEY"] = api_key

        # Create the agent with function tools
        self.agent = Agent(
            name="MCP Task Manager",
            instructions="You are an AI assistant that helps users manage their tasks. Use the provided tools to add, list, complete, delete, or update tasks. Be helpful and concise in your responses.",
            tools=[
                self._create_add_task_tool(),
                self._create_list_tasks_tool(),
                self._create_complete_task_tool(),
                self._create_delete_task_tool(),
                self._create_update_task_tool(),
            ],
        )

        # Store the agent for later use
        self.runner = Runner()
        self.agent = self.agent  # Keep reference to the agent

    def _create_add_task_tool(self):
        """Create the add_task function tool."""

        @function_tool
        def add_task_tool(description: str, user_id: str) -> Dict:
            """
            Add a new task for a user.

            Args:
                description: The task description
                user_id: The ID of the user who owns the task

            Returns:
                Dict containing the created task information
            """
            return add_task(description=description, user_id=user_id)

        return add_task_tool

    def _create_list_tasks_tool(self):
        """Create the list_tasks function tool."""

        @function_tool
        def list_tasks_tool(user_id: str, completed: Optional[bool] = None) -> list:
            """
            List tasks for a user.

            Args:
                user_id: The ID of the user whose tasks to list
                completed: Filter by completion status (None for all, True for completed, False for pending)

            Returns:
                List of task dictionaries
            """
            return list_tasks(user_id=user_id, completed=completed)

        return list_tasks_tool

    def _create_complete_task_tool(self):
        """Create the complete_task function tool."""

        @function_tool
        def complete_task_tool(task_id: str, user_id: str) -> Dict:
            """
            Mark a task as completed.

            Args:
                task_id: The ID of the task to complete
                user_id: The ID of the user who owns the task

            Returns:
                Dict containing the updated task information
            """
            return complete_task(task_id=task_id, user_id=user_id)

        return complete_task_tool

    def _create_delete_task_tool(self):
        """Create the delete_task function tool."""

        @function_tool
        def delete_task_tool(task_id: str, user_id: str) -> Dict:
            """
            Delete a task.

            Args:
                task_id: The ID of the task to delete
                user_id: The ID of the user who owns the task

            Returns:
                Dict containing the deleted task information
            """
            return delete_task(task_id=task_id, user_id=user_id)

        return delete_task_tool

    def _create_update_task_tool(self):
        """Create the update_task function tool."""

        @function_tool
        def update_task_tool(
            task_id: str,
            user_id: str,
            description: Optional[str] = None,
            completed: Optional[bool] = None,
        ) -> Dict:
            """
            Update a task.

            Args:
                task_id: The ID of the task to update
                user_id: The ID of the user who owns the task
                description: New description (optional)
                completed: New completion status (optional)

            Returns:
                Dict containing the updated task information
            """
            return update_task(
                task_id=task_id,
                user_id=user_id,
                description=description,
                completed=completed,
            )

        return update_task_tool

    def run_agent(
        self, user_id: str, message: str, conversation_id: Optional[str] = None
    ) -> str:
        """
        Run the MCP Task agent to process a user message and return a response.

        Args:
            user_id: The ID of the user
            message: The user's message
            conversation_id: The conversation ID (optional, for context)

        Returns:
            The agent's text response
        """
        # Create a thread with the user's message
        thread = [
            {"role": "user", "content": f"User ID: {user_id}. Message: {message}"}
        ]

        # Run the agent
        result = self.runner.run_sync(starting_agent=self.agent, thread=thread)

        # Extract and return the response
        if result and hasattr(result, "messages"):
            # Get the last assistant message
            for msg in reversed(result.messages):
                if msg.get("role") == "assistant":
                    return msg.get("content", "")

        # If no assistant message found, return a default response
        return "I processed your request but couldn't generate a response. Please try again."


def run_mcp_agent(
    user_id: str, message: str, conversation_id: Optional[str] = None
) -> str:
    """
    Convenience function to run the MCP Task agent.

    Args:
        user_id: The ID of the user
        message: The user's message
        conversation_id: The conversation ID (optional)

    Returns:
        The agent's text response
    """
    agent = MCPTaskAgent()
    return agent.run_agent(user_id, message, conversation_id)


if __name__ == "__main__":
    # Example usage
    import sys

    if len(sys.argv) < 3:
        print("Usage: python runner.py <user_id> <message> [conversation_id]")
        sys.exit(1)

    user_id = sys.argv[1]
    message = sys.argv[2]
    conversation_id = sys.argv[3] if len(sys.argv) > 3 else None

    try:
        response = run_mcp_agent(user_id, message, conversation_id)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
