import pytest
import subprocess
import sys
import os
from typer.testing import CliRunner
from src.cli.commands import app


runner = CliRunner()


def test_add_command():
    """Test the add command."""
    # Test adding a task with default priority
    result = runner.invoke(app, ["add", "Test CLI task"])
    assert result.exit_code == 0
    assert "+ Task added with ID" in result.stdout

    # Test adding a task with specific priority
    result = runner.invoke(app, ["add", "Test CLI task 2", "--priority", "High"])
    assert result.exit_code == 0
    assert "+ Task added with ID" in result.stdout


def test_list_command():
    """Test the list command."""
    result = runner.invoke(app, ["list"])
    assert result.exit_code == 0
    # Should contain the tasks we added in previous tests
    assert "Test CLI task" in result.stdout or "No tasks found" in result.stdout


def test_complete_command():
    """Test the complete command."""
    # First add a task to complete
    result = runner.invoke(app, ["add", "Task to complete"])
    assert result.exit_code == 0

    # Get the task ID from the result (it will be the latest task ID)
    # For this test, we'll assume it gets ID 3 based on previous additions
    # We'll add a specific task with a known ID by clearing first

    # Add a new task to get a predictable ID
    result = runner.invoke(app, ["add", "Task for completion test"])
    assert result.exit_code == 0

    # List to see the latest ID
    result = runner.invoke(app, ["list"])
    assert result.exit_code == 0

    # Find the highest ID by parsing the list output
    # For simplicity, let's add a specific task and assume it gets the next ID
    result = runner.invoke(app, ["add", "Specific task for completion"])
    assert result.exit_code == 0

    # Since we don't know the exact ID, we'll test with a mock scenario
    # by directly using the manager to get the latest task ID
    from src.core.manager import TaskManager
    manager = TaskManager()
    all_tasks = manager.get_all_tasks()
    if all_tasks:
        latest_task_id = max(task.id for task in all_tasks)
        result = runner.invoke(app, ["complete", str(latest_task_id)])
        assert result.exit_code == 0
        assert f"+ Task {latest_task_id} marked as completed" in result.stdout


def test_update_command():
    """Test the update command."""
    from src.core.manager import TaskManager
    manager = TaskManager()

    # Add a task to update
    task = manager.add_task("Original task title")

    # Test updating the task
    result = runner.invoke(app, ["update", str(task.id), "Updated task title"])
    assert result.exit_code == 0
    assert f"+ Task {task.id} updated" in result.stdout


def test_delete_command():
    """Test the delete command."""
    from src.core.manager import TaskManager
    manager = TaskManager()

    # Add a task to delete
    task = manager.add_task("Task to delete")

    # Test deleting the task
    result = runner.invoke(app, ["delete", str(task.id)])
    assert result.exit_code == 0
    assert f"+ Task {task.id} deleted" in result.stdout


def test_error_handling():
    """Test error handling for invalid task IDs."""
    # Test completing a non-existent task
    result = runner.invoke(app, ["complete", "999"])
    assert result.exit_code == 0  # Command should not crash
    assert "X Task 999 not found" in result.stdout

    # Test updating a non-existent task
    result = runner.invoke(app, ["update", "999", "New title"])
    assert result.exit_code == 0
    assert "X Task 999 not found" in result.stdout

    # Test deleting a non-existent task
    result = runner.invoke(app, ["delete", "999"])
    assert result.exit_code == 0
    assert "X Task 999 not found" in result.stdout