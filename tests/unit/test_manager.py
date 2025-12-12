import pytest
import os
import json
from datetime import datetime
from src.core.manager import TaskManager
from src.core.models import Task, TaskPriority, TaskStatus


def test_task_manager_initialization():
    """Test initializing a task manager."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")

    assert manager.collection.tasks == []


def test_add_task():
    """Test adding a new task."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task = manager.add_task("Test task", TaskPriority.HIGH)

    assert task.title == "Test task"
    assert task.priority == TaskPriority.HIGH
    assert task.status == TaskStatus.PENDING
    assert task.id == 1

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_add_multiple_tasks():
    """Test adding multiple tasks with auto-incrementing IDs."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task1 = manager.add_task("First task")
    task2 = manager.add_task("Second task", TaskPriority.LOW)

    assert task1.id == 1
    assert task2.id == 2
    assert len(manager.get_all_tasks()) == 2

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_get_all_tasks():
    """Test getting all tasks."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    manager.add_task("Task 1")
    manager.add_task("Task 2")

    tasks = manager.get_all_tasks()

    assert len(tasks) == 2
    assert tasks[0].title == "Task 1"
    assert tasks[1].title == "Task 2"

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_get_task_by_id():
    """Test getting a task by ID."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task = manager.add_task("Test task")
    found_task = manager.get_task_by_id(task.id)

    assert found_task is not None
    assert found_task.id == task.id
    assert found_task.title == "Test task"

    # Test non-existent task
    non_existent = manager.get_task_by_id(999)
    assert non_existent is None

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_update_task():
    """Test updating a task's title."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task = manager.add_task("Original task")
    success = manager.update_task(task.id, "Updated task")

    assert success is True

    updated_task = manager.get_task_by_id(task.id)
    assert updated_task.title == "Updated task"

    # Test updating non-existent task
    failure = manager.update_task(999, "Should not work")
    assert failure is False

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_complete_task():
    """Test completing a task."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task = manager.add_task("Test task")
    success = manager.complete_task(task.id)

    assert success is True

    completed_task = manager.get_task_by_id(task.id)
    assert completed_task.status == TaskStatus.DONE
    assert completed_task.completed_at is not None

    # Test completing already completed task
    # (This should still return True as per our implementation)
    success_again = manager.complete_task(task.id)
    assert success_again is False  # Because status is already DONE

    # Test completing non-existent task
    failure = manager.complete_task(999)
    assert failure is False

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_delete_task():
    """Test deleting a task."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    task = manager.add_task("Test task")
    success = manager.delete_task(task.id)

    assert success is True
    assert manager.get_task_by_id(task.id) is None
    assert len(manager.get_all_tasks()) == 0

    # Test deleting non-existent task
    failure = manager.delete_task(999)
    assert failure is False

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")


def test_file_persistence():
    """Test saving and loading tasks from file."""
    manager = TaskManager(data_file="tests/unit/test_tasks.json")

    # Add some tasks
    manager.add_task("Task 1", TaskPriority.HIGH)
    manager.add_task("Task 2", TaskPriority.LOW)

    # Create a new manager to load from file
    new_manager = TaskManager(data_file="tests/unit/test_tasks.json")

    tasks = new_manager.get_all_tasks()
    assert len(tasks) == 2
    assert tasks[0].title == "Task 1"
    assert tasks[1].title == "Task 2"

    # Clean up test file
    if os.path.exists("tests/unit/test_tasks.json"):
        os.remove("tests/unit/test_tasks.json")