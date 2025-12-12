import pytest
from datetime import datetime
from src.core.models import Task, TaskPriority, TaskStatus, TaskCollection


def test_task_creation():
    """Test creating a new task with required fields."""
    task = Task(
        id=1,
        title="Test task",
        priority=TaskPriority.MEDIUM,
        status=TaskStatus.PENDING
    )

    assert task.id == 1
    assert task.title == "Test task"
    assert task.priority == TaskPriority.MEDIUM
    assert task.status == TaskStatus.PENDING
    assert task.created_at is not None
    assert task.completed_at is None


def test_task_default_values():
    """Test task creation with default values."""
    task = Task(id=1, title="Test task")

    assert task.priority == TaskPriority.MEDIUM
    assert task.status == TaskStatus.PENDING
    assert task.created_at is not None


def test_task_title_validation():
    """Test that task title must not be empty."""
    with pytest.raises(ValueError):
        Task(id=1, title="")


def test_task_collection():
    """Test creating a task collection."""
    collection = TaskCollection()

    assert collection.tasks == []

    # Add a task
    task = Task(id=1, title="Test task")
    collection.tasks.append(task)

    assert len(collection.tasks) == 1
    assert collection.tasks[0].id == 1


def test_task_status_enum():
    """Test task status enum values."""
    assert TaskStatus.PENDING.value == "Pending"
    assert TaskStatus.DONE.value == "Done"


def test_task_priority_enum():
    """Test task priority enum values."""
    assert TaskPriority.LOW.value == "Low"
    assert TaskPriority.MEDIUM.value == "Medium"
    assert TaskPriority.HIGH.value == "High"