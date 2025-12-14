# API Contracts: Task Priority Backend

## Endpoint: POST /api/{user_id}/tasks

### Description
Create a new task with optional priority level for the specified user.

### Parameters
- `user_id` (path): Integer - User ID from JWT token, must match authenticated user

### Request Body
```json
{
  "title": "Task title (string, required)",
  "description": "Task description (string, optional)",
  "priority": "Priority level (string, optional, default: 'medium', values: 'low', 'medium', 'high', 'urgent')"
}
```

### Response
- **201 Created**: Task successfully created
```json
{
  "id": 123,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "user_id": 1,
  "created_at": "2025-12-14T10:30:00Z",
  "updated_at": "2025-12-14T10:30:00Z"
}
```

- **400 Bad Request**: Invalid input (e.g., invalid priority value)
- **401 Unauthorized**: Invalid or expired JWT token
- **403 Forbidden**: User ID in path doesn't match JWT token

## Endpoint: GET /api/{user_id}/tasks

### Description
Retrieve all tasks for the specified user with optional priority filtering.

### Parameters
- `user_id` (path): Integer - User ID from JWT token, must match authenticated user
- `priority` (query, optional): Filter tasks by priority level (values: 'low', 'medium', 'high', 'urgent')

### Response
- **200 OK**: Tasks successfully retrieved
```json
[
  {
    "id": 123,
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "high",
    "user_id": 1,
    "created_at": "2025-12-14T10:30:00Z",
    "updated_at": "2025-12-14T10:30:00Z"
  }
]
```

- **400 Bad Request**: Invalid priority filter value
- **401 Unauthorized**: Invalid or expired JWT token
- **403 Forbidden**: User ID in path doesn't match JWT token

## Endpoint: PUT /api/{user_id}/tasks/{id}

### Description
Update an existing task including its priority level for the specified user.

### Parameters
- `user_id` (path): Integer - User ID from JWT token, must match authenticated user
- `id` (path): Integer - Task ID to update

### Request Body
```json
{
  "title": "Updated task title (string, optional)",
  "description": "Updated task description (string, optional)",
  "completed": "Updated completion status (boolean, optional)",
  "priority": "Updated priority level (string, optional, values: 'low', 'medium', 'high', 'urgent')"
}
```

### Response
- **200 OK**: Task successfully updated
```json
{
  "id": 123,
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "priority": "high",
  "user_id": 1,
  "created_at": "2025-12-14T10:30:00Z",
  "updated_at": "2025-12-14T11:00:00Z"
}
```

- **400 Bad Request**: Invalid input (e.g., invalid priority value)
- **401 Unauthorized**: Invalid or expired JWT token
- **403 Forbidden**: Task doesn't belong to the user or user ID in path doesn't match JWT token
- **404 Not Found**: Task with specified ID doesn't exist

## Endpoint: DELETE /api/{user_id}/tasks/{id}

### Description
Delete an existing task for the specified user (existing endpoint, no changes needed for priority).

### Parameters
- `user_id` (path): Integer - User ID from JWT token, must match authenticated user
- `id` (path): Integer - Task ID to delete

### Response
- **204 No Content**: Task successfully deleted
- **401 Unauthorized**: Invalid or expired JWT token
- **403 Forbidden**: Task doesn't belong to the user or user ID in path doesn't match JWT token
- **404 Not Found**: Task with specified ID doesn't exist