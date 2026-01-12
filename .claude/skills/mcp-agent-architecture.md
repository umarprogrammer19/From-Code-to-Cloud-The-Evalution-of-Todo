# Skill: Building AI Agents with MCP & OpenAI

## 1. Database Schema (`backend/models.py`)
- **Conversation**: `id` (int), `user_id` (str), `created_at`.
- **Message**: `id`, `conversation_id`, `role` (user/assistant), `content` (Text), `tool_calls` (JSON).

## 2. The MCP Server Pattern (`backend/mcp_server.py`)
- Use the official Python MCP SDK.
- Define tools using decorators (e.g., `@mcp.tool()`).
- **Required Tools**:
  - `add_task(user_id, title, description)`
  - `list_tasks(user_id, status)`
  - `complete_task(user_id, task_id)`
  - `delete_task(user_id, task_id)`

## 3. The Agent Runner (`backend/agent.py`)
- Use **OpenAI Agents SDK**.
- **Flow**:
  1. Receive `message` + `history`.
  2. Define the Agent with the MCP Tools attached.
  3. Run the Agent (Stateless).
  4. Capture the response and tool outputs.

## 4. Frontend Integration (`frontend/components/Chat.tsx`)
- Use `<ChatKit />` components.
- Configure `domain_allowlist` in OpenAI settings.
- Point to `POST /api/{user_id}/chat`.