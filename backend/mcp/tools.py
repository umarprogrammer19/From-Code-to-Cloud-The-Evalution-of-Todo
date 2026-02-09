import json
import logging
from typing import Any, Dict

from mcp.server import Server
from mcp.server.experimental.task_context import ServerTaskContext
from mcp.types import CallToolResult, CreateTaskResult, TextContent, Tool, ToolExecution, TASK_REQUIRED
from sqlmodel import Session

from database import get_session
from src.schemas.task import TaskCreate, TaskUpdate
from src.services.task_service import TaskService

logger = logging.getLogger(__name__)

# Initialize the MCP server
server = Server("task-management-mcp")

# Enable experimental tasks
server.experimental.enable_tasks()

@server.list_tools()
async def list_tools():
    """List all available MCP tools for task management."""
    logger.info("Listing available MCP tools.")
    return [
        Tool(
            name="add_task",
            description="Create a new task for the user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer", "description": "ID of the user"},
                    "title": {"type": "string", "description": "Title of the task"},
                    "description": {"type": "string", "description": "Detailed description of the task"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"], "default": "medium"}
                },
                "required": ["user_id", "title"]
            },
            execution=ToolExecution(taskSupport=TASK_REQUIRED),
        ),
        Tool(
            name="list_tasks",
            description="Retrieve all tasks for the user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer", "description": "ID of the user"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "Filter by priority (optional)"}
                },
                "required": ["user_id"]
            },
            execution=ToolExecution(taskSupport=TASK_REQUIRED),
        ),
        Tool(
            name="complete_task",
            description="Mark a task as completed",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer", "description": "ID of the user"},
                    "task_id": {"type": "integer", "description": "ID of the task to complete"}
                },
                "required": ["user_id", "task_id"]
            },
            execution=ToolExecution(taskSupport=TASK_REQUIRED),
        ),
        Tool(
            name="delete_task",
            description="Delete a task",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer", "description": "ID of the user"},
                    "task_id": {"type": "integer", "description": "ID of the task to delete"}
                },
                "required": ["user_id", "task_id"]
            },
            execution=ToolExecution(taskSupport=TASK_REQUIRED),
        ),
        Tool(
            name="update_task",
            description="Update an existing task",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer", "description": "ID of the user"},
                    "task_id": {"type": "integer", "description": "ID of the task to update"},
                    "title": {"type": "string", "description": "New title of the task (optional)"},
                    "description": {"type": "string", "description": "New description of the task (optional)"},
                    "completed": {"type": "boolean", "description": "New completion status (optional)"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "New priority (optional)"}
                },
                "required": ["user_id", "task_id"]
            },
            execution=ToolExecution(taskSupport=TASK_REQUIRED),
        )
    ]

async def handle_add_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the add_task operation."""
    logger.debug(f"handle_add_task received arguments: {arguments}")
    user_id = arguments["user_id"]
    title = arguments["title"]
    logger.info(f"Handling add_task for user {user_id}, title: {title}")
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    description = arguments.get("description", "")
    priority = arguments.get("priority", "medium")

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Creating task...")
        logger.debug(f"Creating task '{title}' for user {user_id}")

        # Get database session
        with next(get_session()) as session:
            task_create = TaskCreate(
                title=title,
                description=description,
                priority=priority
            )
            new_task = TaskService.create_task(session=session, task_in=task_create, user_id=user_id)
            logger.info(f"Task '{new_task.title}' created successfully with ID {new_task.id}.")

            result = {
                "success": True,
                "task_id": new_task.id,
                "message": f"Task '{new_task.title}' created successfully"
            }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_list_tasks(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the list_tasks operation."""
    logger.debug(f"handle_list_tasks received arguments: {arguments}")
    user_id = arguments["user_id"]
    priority_filter = arguments.get("priority")
    logger.info(f"Handling list_tasks for user {user_id}, priority filter: {priority_filter}")
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Retrieving tasks...")
        logger.debug(f"Retrieving tasks for user {user_id} with priority filter {priority_filter}")

        # Get database session
        with next(get_session()) as session:
            tasks = TaskService.get_tasks_by_user(session=session, user_id=user_id, priority=priority_filter)

            tasks_data = []
            for t in tasks:
                tasks_data.append({
                    "id": t.id,
                    "title": t.title,
                    "description": t.description,
                    "completed": t.completed,
                    "priority": t.priority.value,
                    "created_at": t.created_at.isoformat() if hasattr(t, 'created_at') else None,
                    "updated_at": t.updated_at.isoformat() if hasattr(t, 'updated_at') else None
                })

            result = {
                "success": True,
                "tasks": tasks_data,
                "count": len(tasks_data)
            }
            logger.info(f"Retrieved {len(tasks_data)} tasks for user {user_id}.")

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_complete_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the complete_task operation."""
    user_id = arguments["user_id"]
    task_id = arguments["task_id"]
    logger.info(f"Handling complete_task for user {user_id}, task ID: {task_id}")
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Completing task...")
        logger.debug(f"Attempting to complete task {task_id} for user {user_id}")

        # Get database session
        with next(get_session()) as session:
            # First get the existing task to check if it exists and belongs to user
            existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
            if not existing_task:
                logger.warning(f"Task {task_id} not found or does not belong to user {user_id}.")
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }
                return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

            # Update the task to mark as completed
            task_update = TaskUpdate(completed=True)
            updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

            if updated_task:
                logger.info(f"Task '{updated_task.title}' (ID: {updated_task.id}) marked as completed.")
                result = {
                    "success": True,
                    "message": f"Task '{updated_task.title}' marked as completed"
                }
            else:
                logger.error(f"Failed to update task {task_id} for user {user_id}.")
                result = {
                    "success": False,
                    "message": "Failed to update task"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_delete_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the delete_task operation."""
    user_id = arguments["user_id"]
    task_id = arguments["task_id"]
    logger.info(f"Handling delete_task for user {user_id}, task ID: {task_id}")
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Deleting task...")
        logger.debug(f"Attempting to delete task {task_id} for user {user_id}")

        # Get database session
        with next(get_session()) as session:
            success = TaskService.delete_task(session=session, task_id=task_id, user_id=user_id)

            if success:
                logger.info(f"Task {task_id} deleted successfully.")
                result = {
                    "success": True,
                    "message": "Task deleted successfully"
                }
            else:
                logger.warning(f"Task {task_id} not found or does not belong to user {user_id}.")
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_update_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the update_task operation."""
    user_id = arguments["user_id"]
    task_id = arguments["task_id"]
    logger.info(f"Handling update_task for user {user_id}, task ID: {task_id}")
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    update_data = {k: v for k, v in arguments.items() if k in ["title", "description", "completed", "priority"]}

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Updating task...")
        logger.debug(f"Attempting to update task {task_id} for user {user_id} with data: {update_data}")

        # Get database session
        with next(get_session()) as session:
            # First get the existing task to check if it exists and belongs to user
            existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
            if not existing_task:
                logger.warning(f"Task {task_id} not found or does not belong to user {user_id}.")
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }
                return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

            # Create TaskUpdate object with provided data
            task_update = TaskUpdate(**update_data)
            updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

            if updated_task:
                logger.info(f"Task '{updated_task.title}' (ID: {updated_task.id}) updated successfully.")
                result = {
                    "success": True,
                    "message": f"Task '{updated_task.title}' updated successfully"
                }
            else:
                logger.error(f"Failed to update task {task_id} for user {user_id}.")
                result = {
                    "success": False,
                    "message": "Failed to update task"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

@server.call_tool()
async def handle_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult | CreateTaskResult:
    """Route tool calls to appropriate handlers."""
    logger.debug(f"Received tool call: {name} with arguments: {arguments}")
    if name == "add_task":
        return await handle_add_task(arguments)
    elif name == "list_tasks":
        return await handle_list_tasks(arguments)
    elif name == "complete_task":
        return await handle_complete_task(arguments)
    elif name == "delete_task":
        return await handle_delete_task(arguments)
    elif name == "update_task":
        return await handle_update_task(arguments)
    else:
        logger.error(f"Unknown tool called: {name}")
        return CallToolResult(
            content=[TextContent(type="text", text=f"Unknown tool: {name}")],
            isError=True
        )
