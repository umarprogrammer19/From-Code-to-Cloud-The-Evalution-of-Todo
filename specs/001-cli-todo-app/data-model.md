# Data Model: CLI Todo App

## Task Entity

### Fields
- **id**: `int` - Unique identifier for the task (auto-generated)
- **title**: `str` - Title of the task (required, min length: 1)
- **priority**: `str` - Priority level (enum: "Low", "Medium", "High"; default: "Medium")
- **status**: `str` - Current status (enum: "Pending", "Done"; default: "Pending")
- **created_at**: `datetime` - Timestamp when task was created (auto-generated)
- **completed_at**: `datetime | None` - Timestamp when task was completed (optional)

### Validation Rules
- Title must not be empty
- Priority must be one of: "Low", "Medium", "High"
- Status must be one of: "Pending", "Done"
- ID must be unique within the task collection

### State Transitions
- `Pending` → `Done` (when task is completed)
- `Done` → `Pending` (if task completion is undone - future enhancement)

## TaskManager Entity

### Responsibilities
- Load tasks from JSON file
- Save tasks to JSON file
- Generate unique IDs for new tasks
- Provide CRUD operations for tasks
- Validate task data before operations

### Methods
- `add_task(title: str, priority: str = "Medium") -> Task`: Creates a new task
- `get_all_tasks() -> List[Task]`: Returns all tasks
- `get_task_by_id(task_id: int) -> Task | None`: Returns specific task or None
- `update_task(task_id: int, new_title: str) -> bool`: Updates task title
- `complete_task(task_id: int) -> bool`: Marks task as completed
- `delete_task(task_id: int) -> bool`: Removes task from collection
- `save_to_file() -> None`: Persists tasks to JSON file
- `load_from_file() -> None`: Loads tasks from JSON file

## JSON Storage Format

### File Location
- Path: `data/tasks.json`

### Structure
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Sample task",
      "priority": "Medium",
      "status": "Pending",
      "created_at": "2025-12-12T10:30:00",
      "completed_at": null
    },
    {
      "id": 2,
      "title": "Completed task",
      "priority": "High",
      "status": "Done",
      "created_at": "2025-12-12T10:35:00",
      "completed_at": "2025-12-12T11:00:00"
    }
  ]
}
```

## Pydantic Models

### Task Model
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TaskStatus(str, Enum):
    PENDING = "Pending"
    DONE = "Done"

class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Task(BaseModel):
    id: int
    title: str = Field(..., min_length=1)
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
```

### TaskCollection Model
```python
from pydantic import BaseModel
from typing import List

class TaskCollection(BaseModel):
    tasks: List[Task] = []
```