# Quickstart Guide: CLI Todo App

## Prerequisites

- Python 3.11 or higher
- `uv` package manager installed

## Setup

1. **Install dependencies**:
   ```bash
   uv add typer rich pydantic pytest
   ```

2. **Create project structure**:
   ```bash
   mkdir -p src/core src/cli data tests/unit tests/integration
   touch data/tasks.json  # Initialize empty tasks file
   ```

3. **Initialize the project**:
   ```bash
   # Create the main entry point
   touch src/todo.py
   # Create core modules
   touch src/core/__init__.py src/core/models.py src/core/manager.py
   # Create CLI modules
   touch src/cli/__init__.py src/cli/main.py src/cli/commands.py
   # Create test modules
   touch tests/conftest.py tests/unit/__init__.py tests/integration/__init__.py
   ```

## Core Implementation

### 1. Define Pydantic Models (`src/core/models.py`)

```python
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional, List

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

class TaskCollection(BaseModel):
    tasks: List[Task] = []
```

### 2. Implement Task Manager (`src/core/manager.py`)

```python
import json
import os
from typing import List, Optional
from .models import Task, TaskStatus, TaskPriority, TaskCollection

class TaskManager:
    def __init__(self, data_file: str = "data/tasks.json"):
        self.data_file = data_file
        self.collection = TaskCollection()
        self.load_from_file()

    def get_next_id(self) -> int:
        if not self.collection.tasks:
            return 1
        return max(task.id for task in self.collection.tasks) + 1

    def add_task(self, title: str, priority: TaskPriority = TaskPriority.MEDIUM) -> Task:
        task = Task(
            id=self.get_next_id(),
            title=title,
            priority=priority
        )
        self.collection.tasks.append(task)
        self.save_to_file()
        return task

    def get_all_tasks(self) -> List[Task]:
        return self.collection.tasks

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        for task in self.collection.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, new_title: str) -> bool:
        task = self.get_task_by_id(task_id)
        if task:
            task.title = new_title
            self.save_to_file()
            return True
        return False

    def complete_task(self, task_id: int) -> bool:
        task = self.get_task_by_id(task_id)
        if task and task.status != TaskStatus.DONE:
            task.status = TaskStatus.DONE
            task.completed_at = datetime.now()
            self.save_to_file()
            return True
        return False

    def delete_task(self, task_id: int) -> bool:
        task = self.get_task_by_id(task_id)
        if task:
            self.collection.tasks.remove(task)
            self.save_to_file()
            return True
        return False

    def save_to_file(self):
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        with open(self.data_file, 'w', encoding='utf-8') as f:
            f.write(self.collection.model_dump_json(indent=2))

    def load_from_file(self):
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if content.strip():
                    data = json.loads(content)
                    self.collection = TaskCollection.model_validate(data)
        else:
            # Create the file with an empty collection if it doesn't exist
            self.save_to_file()
```

### 3. Create CLI Interface (`src/cli/commands.py`)

```python
import typer
from rich.table import Table
from rich.console import Console
from typing import Optional
from ..core.models import TaskPriority
from ..core.manager import TaskManager

console = Console()
app = typer.Typer()

@app.command()
def add(title: str, priority: Optional[TaskPriority] = TaskPriority.MEDIUM):
    """Add a new task to the list."""
    manager = TaskManager()
    task = manager.add_task(title, priority)
    console.print(f"[green]✓ Task added with ID {task.id}[/green]")

@app.command()
def list():
    """Show all tasks in a formatted table."""
    manager = TaskManager()
    tasks = manager.get_all_tasks()

    if not tasks:
        console.print("[yellow]No tasks found.[/yellow]")
        return

    table = Table(title="Todo List")
    table.add_column("ID", style="cyan", no_wrap=True)
    table.add_column("Title", style="magenta")
    table.add_column("Priority", style="blue")
    table.add_column("Status", style="green")

    for task in tasks:
        table.add_row(
            str(task.id),
            task.title,
            task.priority.value,
            task.status.value
        )

    console.print(table)

@app.command()
def complete(task_id: int):
    """Mark a task as completed."""
    manager = TaskManager()
    if manager.complete_task(task_id):
        console.print(f"[green]✓ Task {task_id} marked as completed[/green]")
    else:
        console.print(f"[red]✗ Task {task_id} not found[/red]")

@app.command()
def delete(task_id: int):
    """Delete a task."""
    manager = TaskManager()
    if manager.delete_task(task_id):
        console.print(f"[green]✓ Task {task_id} deleted[/green]")
    else:
        console.print(f"[red]✗ Task {task_id} not found[/red]")

@app.command()
def update(task_id: int, new_title: str):
    """Update a task's title."""
    manager = TaskManager()
    if manager.update_task(task_id, new_title):
        console.print(f"[green]✓ Task {task_id} updated[/green]")
    else:
        console.print(f"[red]✗ Task {task_id} not found[/red]")

if __name__ == "__main__":
    app()
```

### 4. Main Application Entry Point (`src/todo.py`)

```python
import typer
from src.cli.commands import app

def main():
    app()

if __name__ == "__main__":
    main()
```

## Running the Application

1. **Install dependencies**:
   ```bash
   uv add typer rich pydantic pytest
   ```

2. **Run the application**:
   ```bash
   python -m src.todo add "My first task" --priority High
   python -m src.todo list
   python -m src.todo complete 1
   ```

## Testing

Create unit tests in `tests/unit/test_models.py` and `tests/unit/test_manager.py`, and integration tests in `tests/integration/test_cli.py`.

Example test:
```python
def test_add_task():
    manager = TaskManager()
    task = manager.add_task("Test task", TaskPriority.MEDIUM)
    assert task.title == "Test task"
    assert task.priority == TaskPriority.MEDIUM
    assert task.status == TaskStatus.PENDING
```

Run tests with:
```bash
pytest
```