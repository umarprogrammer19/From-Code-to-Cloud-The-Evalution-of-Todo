# Quickstart: Task Priority Backend

## Prerequisites
- Python 3.13+
- uv package manager
- Access to Neon Serverless PostgreSQL database
- Existing backend infrastructure from previous phases

## Setup Instructions

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install required dependencies using uv (if not already installed):**
   ```bash
   uv add enum34  # For Python < 3.4 compatibility (if needed)
   ```

3. **Update the Task model** in `backend/src/models/task.py` to include priority field:
   ```python
   from enum import Enum
   from sqlmodel import Field
   from pydantic import BaseModel

   class PriorityLevel(str, Enum):
       low = "low"
       medium = "medium"
       high = "high"
       urgent = "urgent"

   # Add priority field to Task model
   # priority: PriorityLevel = Field(default=PriorityLevel.medium)
   ```

4. **Update Task schemas** in `backend/src/schemas/task.py` to include priority:
   ```python
   # In TaskCreate schema, make priority optional with default
   # In TaskUpdate schema, make priority optional
   # In TaskResponse schema, include priority field
   ```

5. **Update the task service** in `backend/src/services/task_service.py` to handle priority operations.

6. **Run database migrations** to add the priority column to the tasks table.

## API Usage Examples

### Creating a Task with Priority
```bash
curl -X POST "http://localhost:8000/api/1/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "High Priority Task", "description": "This is urgent", "priority": "high"}'
```

### Updating Task Priority
```bash
curl -X PUT "http://localhost:8000/api/1/tasks/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priority": "urgent"}'
```

### Filtering Tasks by Priority
```bash
curl -X GET "http://localhost:8000/api/1/tasks?priority=high" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Getting All Tasks (with priority information)
```bash
curl -X GET "http://localhost:8000/api/1/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing
Run the tests with:
```bash
cd backend
uv run pytest
```

## Key Implementation Notes
- Priority values are restricted to: "low", "medium", "high", "urgent"
- Default priority when not specified is "medium"
- All existing functionality remains unchanged (backward compatibility)
- Priority filtering is case-sensitive and must match exact values