"""
MCP Tools for Task Management Operations

This module implements the required MCP tools for task management operations
following the specifications in the Phase III Specs.
"""

from typing import Dict, List, Optional
from sqlmodel import Session, select
import sys
import os
from pathlib import Path

# Add the backend directory to the path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from src.models.user import User
from src.models.task import Task, TaskRead
from database import engine
import json
import uuid


def add_task(description: str, user_id: str) -> Dict:
    """
    Add a new task for a user.

    Args:
        description: The task description
        user_id: The ID of the user who owns the task

    Returns:
        Dict containing the created task information
    """
    with Session(engine) as session:
        # Convert user_id to int if it's a string
        try:
            user_id_int = int(user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id: {user_id}")

        # Get the user
        user = session.exec(select(User).where(User.id == user_id_int)).first()
        if not user:
            raise ValueError(f"User with id {user_id} not found")

        # Create new task
        task = Task(
            title=description,  # Using title instead of description
            description=description,
            user_id=user_id_int,
            completed=False
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority.value,
            "user_id": task.user_id
        }


def list_tasks(user_id: str, completed: Optional[bool] = None) -> List[Dict]:
    """
    List tasks for a user.

    Args:
        user_id: The ID of the user whose tasks to list
        completed: Filter by completion status (None for all, True for completed, False for pending)

    Returns:
        List of task dictionaries
    """
    with Session(engine) as session:
        # Convert user_id to int if it's a string
        try:
            user_id_int = int(user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id: {user_id}")

        query = select(Task).where(Task.user_id == user_id_int)

        if completed is not None:
            query = query.where(Task.completed == completed)

        tasks = session.exec(query).all()

        return [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "completed": task.completed,
                "priority": task.priority.value,
                "user_id": task.user_id
            }
            for task in tasks
        ]


def complete_task(task_id: str, user_id: str) -> Dict:
    """
    Mark a task as completed.

    Args:
        task_id: The ID of the task to complete
        user_id: The ID of the user who owns the task

    Returns:
        Dict containing the updated task information
    """
    with Session(engine) as session:
        # Convert IDs to int if they're strings
        try:
            task_id_int = int(task_id)
            user_id_int = int(user_id)
        except ValueError:
            raise ValueError(f"Invalid task_id or user_id: {task_id}, {user_id}")

        # Verify the task belongs to the user
        task = session.exec(
            select(Task).where(Task.id == task_id_int).where(Task.user_id == user_id_int)
        ).first()

        if not task:
            raise ValueError(f"Task with id {task_id} not found for user {user_id}")

        task.completed = True
        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority.value,
            "user_id": task.user_id
        }


def delete_task(task_id: str, user_id: str) -> Dict:
    """
    Delete a task.

    Args:
        task_id: The ID of the task to delete
        user_id: The ID of the user who owns the task

    Returns:
        Dict containing the deleted task information
    """
    with Session(engine) as session:
        # Convert IDs to int if they're strings
        try:
            task_id_int = int(task_id)
            user_id_int = int(user_id)
        except ValueError:
            raise ValueError(f"Invalid task_id or user_id: {task_id}, {user_id}")

        # Verify the task belongs to the user
        task = session.exec(
            select(Task).where(Task.id == task_id_int).where(Task.user_id == user_id_int)
        ).first()

        if not task:
            raise ValueError(f"Task with id {task_id} not found for user {user_id}")

        # Store task data before deletion for return
        task_data = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority.value,
            "user_id": task.user_id
        }

        session.delete(task)
        session.commit()

        return task_data


def update_task(task_id: str, user_id: str, description: Optional[str] = None, completed: Optional[bool] = None) -> Dict:
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
    with Session(engine) as session:
        # Convert IDs to int if they're strings
        try:
            task_id_int = int(task_id)
            user_id_int = int(user_id)
        except ValueError:
            raise ValueError(f"Invalid task_id or user_id: {task_id}, {user_id}")

        # Verify the task belongs to the user
        task = session.exec(
            select(Task).where(Task.id == task_id_int).where(Task.user_id == user_id_int)
        ).first()

        if not task:
            raise ValueError(f"Task with id {task_id} not found for user {user_id}")

        # Update fields if provided
        if description is not None:
            task.title = description  # Update title as well as description
            task.description = description
        if completed is not None:
            task.completed = completed

        session.add(task)
        session.commit()
        session.refresh(task)

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority.value,
            "user_id": task.user_id
        }


# MCP Tool Definitions for the OpenAI Agent
MCP_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Add a new task for a user",
            "parameters": {
                "type": "object",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "The task description"
                    },
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user who owns the task"
                    }
                },
                "required": ["description", "user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List tasks for a user",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user whose tasks to list"
                    },
                    "completed": {
                        "type": "boolean",
                        "description": "Filter by completion status (None for all, True for completed, False for pending)"
                    }
                },
                "required": ["user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to complete"
                    },
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user who owns the task"
                    }
                },
                "required": ["task_id", "user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to delete"
                    },
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user who owns the task"
                    }
                },
                "required": ["task_id", "user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to update"
                    },
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user who owns the task"
                    },
                    "description": {
                        "type": "string",
                        "description": "New description (optional)"
                    },
                    "completed": {
                        "type": "boolean",
                        "description": "New completion status (optional)"
                    }
                },
                "required": ["task_id", "user_id"]
            }
        }
    }
]