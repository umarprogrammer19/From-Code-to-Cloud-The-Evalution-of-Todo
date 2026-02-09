import json
import logging
from typing import Any, Dict

from agents import Agent, Runner, function_tool
from sqlmodel import Session

from database import get_session
from src.schemas.task import TaskCreate, TaskUpdate
from src.services.task_service import TaskService

logger = logging.getLogger(__name__)

# Define function tools for the agent
@function_tool
def add_task(user_id: int, title: str, description: str = "", priority: str = "medium") -> str:
    """Create a new task for the user."""
    logger.info(f"Agent tool: add_task called for user {user_id}, title: {title}")
    with next(get_session()) as session:
        task_create = TaskCreate(
            title=title,
            description=description,
            priority=priority
        )
        new_task = TaskService.create_task(session=session, task_in=task_create, user_id=user_id)
        logger.info(f"Agent tool: Task '{new_task.title}' created successfully with ID {new_task.id}.")

        return json.dumps({
            "success": True,
            "task_id": new_task.id,
            "message": f"Task '{new_task.title}' created successfully"
        })

@function_tool
def list_tasks(user_id: int, priority: str = None) -> str:
    """Retrieve all tasks for the user."""
    logger.info(f"Agent tool: list_tasks called for user {user_id}, priority filter: {priority}")
    with next(get_session()) as session:
        tasks = TaskService.get_tasks_by_user(session=session, user_id=user_id, priority=priority)

        tasks_data = []
        for t in tasks:
            tasks_data.append({
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
                "priority": t.priority.value
            })
        logger.info(f"Agent tool: Retrieved {len(tasks_data)} tasks for user {user_id}.")

        return json.dumps({
            "success": True,
            "tasks": tasks_data,
            "count": len(tasks_data)
        })

@function_tool
def complete_task(user_id: int, task_id: int) -> str:
    """Mark a task as completed."""
    logger.info(f"Agent tool: complete_task called for user {user_id}, task ID: {task_id}")
    with next(get_session()) as session:
        # First get the existing task to check if it exists and belongs to user
        existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
        if not existing_task:
            logger.warning(f"Agent tool: Task {task_id} not found or does not belong to user {user_id}.")
            return json.dumps({
                "success": False,
                "message": "Task not found or doesn't belong to user"
            })

        # Update the task to mark as completed
        task_update = TaskUpdate(completed=True)
        updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

        if updated_task:
            logger.info(f"Agent tool: Task '{updated_task.title}' (ID: {updated_task.id}) marked as completed.")
            return json.dumps({
                "success": True,
                "message": f"Task '{updated_task.title}' marked as completed"
            })
        else:
            logger.error(f"Agent tool: Failed to update task {task_id} for user {user_id}.")
            return json.dumps({
                "success": False,
                "message": "Failed to update task"
            })

@function_tool
def delete_task(user_id: int, task_id: int) -> str:
    """Delete a task."""
    logger.info(f"Agent tool: delete_task called for user {user_id}, task ID: {task_id}")
    with next(get_session()) as session:
        success = TaskService.delete_task(session=session, task_id=task_id, user_id=user_id)

        if success:
            logger.info(f"Agent tool: Task {task_id} deleted successfully.")
            return json.dumps({
                "success": True,
                "message": "Task deleted successfully"
            })
        else:
            logger.warning(f"Agent tool: Task {task_id} not found or does not belong to user {user_id}.")
            return json.dumps({
                "success": False,
                "message": "Task not found or doesn't belong to user"
            })

@function_tool
def update_task(user_id: int, task_id: int, title: str = None, description: str = None,
               completed: bool = None, priority: str = None) -> str:
    """Update an existing task."""
    logger.info(f"Agent tool: update_task called for user {user_id}, task ID: {task_id}")
    with next(get_session()) as session:
        # First get the existing task to check if it exists and belongs to user
        existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
        if not existing_task:
            logger.warning(f"Agent tool: Task {task_id} not found or does not belong to user {user_id}.")
            return json.dumps({
                "success": False,
                "message": "Task not found or doesn't belong to user"
            })

        # Prepare update data
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if description is not None:
            update_data["description"] = description
        if completed is not None:
            update_data["completed"] = completed
        if priority is not None:
            update_data["priority"] = priority

        # Create TaskUpdate object with provided data
        task_update = TaskUpdate(**update_data)
        updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

        if updated_task:
            logger.info(f"Agent tool: Task '{updated_task.title}' (ID: {updated_task.id}) updated successfully.")
            return json.dumps({
                "success": True,
                "message": f"Task '{updated_task.title}' updated successfully"
            })
        else:
            logger.error(f"Agent tool: Failed to update task {task_id} for user {user_id}.")
            return json.dumps({
                "success": False,
                "message": "Failed to update task"
            })

# Create the agent with task management tools
agent = Agent(
    name="Task Management Assistant",
    instructions="You are a helpful assistant that helps users manage their tasks. Use the available tools to create, list, update, complete, and delete tasks.",
    tools=[add_task, list_tasks, complete_task, delete_task, update_task],
)

async def run_agent(user_id: int, message: str, conversation_id: str) -> str:
    """
    Run the AI agent with the given parameters.

    Args:
        user_id: The ID of the user
        message: The user's message to process
        conversation_id: The ID of the conversation

    Returns:
        The agent's response as a string
    """
    logger.info(f"Running agent for user {user_id}, conversation {conversation_id} with message: {message}")
    result = await Runner.run(agent, input=message)
    logger.info(f"Agent finished for user {user_id}, conversation {conversation_id}. Output: {result.final_output}")
    return result.final_output