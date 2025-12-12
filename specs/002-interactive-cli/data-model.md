# Data Model: Interactive CLI Todo Application

## Core Entities

### Task
The primary entity representing a todo item.

```python
class Task(BaseModel):
    id: int                    # Unique identifier for the task
    title: str                # Task description (min_length=1)
    priority: TaskPriority    # Enum: LOW, MEDIUM, HIGH
    status: TaskStatus        # Enum: PENDING, DONE
    created_at: datetime      # Timestamp when task was created
    completed_at: Optional[datetime]  # Timestamp when task was completed (if applicable)
```

### TaskPriority (Enum)
Enumeration for task priority levels.

```python
class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
```

### TaskStatus (Enum)
Enumeration for task status.

```python
class TaskStatus(str, Enum):
    PENDING = "Pending"
    DONE = "Done"
```

### TaskCollection
Container for multiple tasks.

```python
class TaskCollection(BaseModel):
    tasks: List[Task] = []    # List of all tasks
```

## Relationships

- `TaskCollection` contains multiple `Task` entities
- Each `Task` has a unique `id` within the collection
- `Task` entities have independent `priority` and `status` values

## Validation Rules

- Task title must have minimum length of 1 character
- Task priority must be one of the defined enum values
- Task status must be one of the defined enum values
- Task ID must be unique within the collection
- Completed tasks have a non-null `completed_at` timestamp

## State Transitions

- Task starts with `status=PENDING`
- When completed, status changes to `DONE` and `completed_at` is set to current timestamp
- Status can only transition from `PENDING` to `DONE` (no reverting to pending)

## Data Flow

1. **Add Task**: New Task created with `status=PENDING`, `priority=MEDIUM` (default)
2. **Complete Task**: Task status updated to `DONE`, `completed_at` timestamp set
3. **Update Task**: Task title updated, other properties preserved
4. **Delete Task**: Task removed from TaskCollection
5. **List Tasks**: All tasks retrieved from TaskCollection

## Persistence Model

- Tasks stored in `data/tasks.json` as serialized JSON
- File-based persistence using pydantic's `model_dump_json()` and `model_validate()`
- File is created if it doesn't exist
- Empty collection initialized if file is empty or invalid