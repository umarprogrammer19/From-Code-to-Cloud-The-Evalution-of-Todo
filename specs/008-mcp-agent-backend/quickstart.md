# Quickstart: MCP Agent Backend

## Setup

### Prerequisites
- Python 3.13+ installed
- uv package manager installed
- Neon Serverless PostgreSQL database configured
- OpenAI API key available in environment

### Installation
1. Install required dependencies:
   ```bash
   uv add openai-agents mcp-server
   ```

2. Ensure database connection is configured in the application settings

## MCP Tools Implementation

### MCP Tools Module (backend/mcp/tools.py)
```python
from mcp.server import Server
from mcp.server.experimental.task_context import ServerTaskContext
from mcp.types import CallToolResult, CreateTaskResult, TextContent, Tool, ToolExecution, TASK_REQUIRED
from sqlmodel import Session
from database import get_session
from src.services.task_service import TaskService
from src.schemas.task import TaskCreate, TaskUpdate
from typing import Dict, Any
import json

# Initialize the MCP server
server = Server("task-management-mcp")

# Enable experimental tasks
server.experimental.enable_tasks()

@server.list_tools()
async def list_tools():
    """List all available MCP tools for task management."""
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
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    user_id = arguments["user_id"]
    title = arguments["title"]
    description = arguments.get("description", "")
    priority = arguments.get("priority", "medium")

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Creating task...")

        # Get database session
        with next(get_session()) as session:
            task_create = TaskCreate(
                title=title,
                description=description,
                priority=priority
            )
            new_task = TaskService.create_task(session=session, task_in=task_create, user_id=user_id)

            result = {
                "success": True,
                "task_id": new_task.id,
                "message": f"Task '{new_task.title}' created successfully"
            }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_list_tasks(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the list_tasks operation."""
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    user_id = arguments["user_id"]
    priority_filter = arguments.get("priority")

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Retrieving tasks...")

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

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_complete_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the complete_task operation."""
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    user_id = arguments["user_id"]
    task_id = arguments["task_id"]

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Completing task...")

        # Get database session
        with next(get_session()) as session:
            # First get the existing task to check if it exists and belongs to user
            existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
            if not existing_task:
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }
                return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

            # Update the task to mark as completed
            task_update = TaskUpdate(completed=True)
            updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

            if updated_task:
                result = {
                    "success": True,
                    "message": f"Task '{updated_task.title}' marked as completed"
                }
            else:
                result = {
                    "success": False,
                    "message": "Failed to update task"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_delete_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the delete_task operation."""
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    user_id = arguments["user_id"]
    task_id = arguments["task_id"]

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Deleting task...")

        # Get database session
        with next(get_session()) as session:
            success = TaskService.delete_task(session=session, task_id=task_id, user_id=user_id)

            if success:
                result = {
                    "success": True,
                    "message": "Task deleted successfully"
                }
            else:
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

async def handle_update_task(arguments: Dict[str, Any]) -> CreateTaskResult:
    """Handle the update_task operation."""
    ctx = server.request_context
    ctx.experimental.validate_task_mode(TASK_REQUIRED)

    user_id = arguments["user_id"]
    task_id = arguments["task_id"]
    update_data = {k: v for k, v in arguments.items() if k in ["title", "description", "completed", "priority"]}

    async def work(task: ServerTaskContext) -> CallToolResult:
        await task.update_status("Updating task...")

        # Get database session
        with next(get_session()) as session:
            # First get the existing task to check if it exists and belongs to user
            existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
            if not existing_task:
                result = {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }
                return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

            # Create TaskUpdate object with provided data
            task_update = TaskUpdate(**update_data)
            updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

            if updated_task:
                result = {
                    "success": True,
                    "message": f"Task '{updated_task.title}' updated successfully"
                }
            else:
                result = {
                    "success": False,
                    "message": "Failed to update task"
                }

            return CallToolResult(content=[TextContent(type="text", text=json.dumps(result))])

    return await ctx.experimental.run_task(work)

@server.call_tool()
async def handle_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult | CreateTaskResult:
    """Route tool calls to appropriate handlers."""
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
        return CallToolResult(
            content=[TextContent(type="text", text=f"Unknown tool: {name}")],
            isError=True
        )
```

## Agent Logic Implementation

### Agent Runner Module (backend/agent/runner.py)
```python
from agents import Agent, Runner, function_tool
from sqlmodel import Session
from database import get_session
from src.services.task_service import TaskService
from src.schemas.task import TaskCreate, TaskUpdate
from typing import Dict, Any
import json

# Define function tools for the agent
@function_tool
def add_task(user_id: int, title: str, description: str = "", priority: str = "medium") -> str:
    """Create a new task for the user."""
    with next(get_session()) as session:
        task_create = TaskCreate(
            title=title,
            description=description,
            priority=priority
        )
        new_task = TaskService.create_task(session=session, task_in=task_create, user_id=user_id)

        return json.dumps({
            "success": True,
            "task_id": new_task.id,
            "message": f"Task '{new_task.title}' created successfully"
        })

@function_tool
def list_tasks(user_id: int, priority: str = None) -> str:
    """Retrieve all tasks for the user."""
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

        return json.dumps({
            "success": True,
            "tasks": tasks_data,
            "count": len(tasks_data)
        })

@function_tool
def complete_task(user_id: int, task_id: int) -> str:
    """Mark a task as completed."""
    with next(get_session()) as session:
        # First get the existing task to check if it exists and belongs to user
        existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
        if not existing_task:
            return json.dumps({
                "success": False,
                "message": "Task not found or doesn't belong to user"
            })

        # Update the task to mark as completed
        task_update = TaskUpdate(completed=True)
        updated_task = TaskService.update_task(session=session, task_id=task_id, task_in=task_update, user_id=user_id)

        if updated_task:
            return json.dumps({
                "success": True,
                "message": f"Task '{updated_task.title}' marked as completed"
            })
        else:
            return json.dumps({
                "success": False,
                "message": "Failed to update task"
            })

@function_tool
def delete_task(user_id: int, task_id: int) -> str:
    """Delete a task."""
    with next(get_session()) as session:
        success = TaskService.delete_task(session=session, task_id=task_id, user_id=user_id)

        if success:
            return json.dumps({
                "success": True,
                "message": "Task deleted successfully"
            })
        else:
            return json.dumps({
                "success": False,
                "message": "Task not found or doesn't belong to user"
            })

@function_tool
def update_task(user_id: int, task_id: int, title: str = None, description: str = None,
               completed: bool = None, priority: str = None) -> str:
    """Update an existing task."""
    with next(get_session()) as session:
        # First get the existing task to check if it exists and belongs to user
        existing_task = TaskService.get_task_by_id(session=session, task_id=task_id, user_id=user_id)
        if not existing_task:
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
            return json.dumps({
                "success": True,
                "message": f"Task '{updated_task.title}' updated successfully"
            })
        else:
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
    result = await Runner.run(agent, input=message)
    return result.final_output
```

## API Endpoint Implementation

### Chat API Endpoint (backend/api/chat.py)
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Dict, Any
from database import get_session
from src.db.chat_service import get_or_create_conversation, add_message, get_chat_history
from agent.runner import run_agent
from uuid import UUID

router = APIRouter(prefix="/api/{user_id}", tags=["chat"])

@router.post("/chat")
async def chat_endpoint(user_id: str, message: str, conversation_id: str = None):
    """
    Main chat endpoint that handles user messages and returns AI responses.

    Args:
        user_id: The ID of the user
        message: The user's message
        conversation_id: Optional conversation ID (will create new if not provided)

    Returns:
        Dictionary with conversation_id and response
    """
    # Convert user_id to integer for database operations (assuming it's stored as int in db)
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user_id format")

    # Get database session
    with next(get_session()) as session:
        # Get or create conversation
        if conversation_id:
            try:
                conv_uuid = UUID(conversation_id)
                # Check if conversation exists and belongs to user
                # We'll need to create a function to get conversation by ID and validate user
                from src.models.conversation import Conversation
                conversation = session.get(Conversation, conv_uuid)
                if not conversation or conversation.user_id != user_id:
                    # Create new conversation if not found or doesn't belong to user
                    conversation = get_or_create_conversation(session, user_id)
            except ValueError:
                # Invalid UUID format, create new conversation
                conversation = get_or_create_conversation(session, user_id)
        else:
            conversation = get_or_create_conversation(session, user_id)

        # Add user message to conversation
        user_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role="user",
            content=message
        )

        # Run the agent with the user's message
        try:
            response = await run_agent(
                user_id=user_id_int,
                message=message,
                conversation_id=str(conversation.id)
            )
        except Exception as e:
            # Handle agent errors gracefully
            response = f"Sorry, I encountered an error processing your request: {str(e)}"

        # Add assistant response to conversation
        assistant_message = add_message(
            session=session,
            conversation_id=conversation.id,
            role="assistant",
            content=response
        )

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
```

## Usage Example

```python
# Example of how to use the MCP server
from mcp.tools import server

# Start the MCP server (typically done in main.py or startup script)
if __name__ == "__main__":
    import uvicorn
    from starlette.applications import Starlette
    from starlette.routing import Mount
    from mcp.server.streamable_http_manager import StreamableHTTPSessionManager

    session_manager = StreamableHTTPSessionManager(app=server)

    @asynccontextmanager
    async def lifespan(app: Starlette) -> AsyncIterator[None]:
        async with session_manager.run():
            yield

    app = Starlette(
        routes=[Mount("/mcp", app=session_manager.handle_request)],
        lifespan=lifespan,
    )

    uvicorn.run(app, host="127.0.0.1", port=8001)
```