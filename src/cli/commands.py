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
    console.print(f"[green]+ Task added with ID {task.id}[/green]")


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
        console.print(f"[green]+ Task {task_id} marked as completed[/green]")
    else:
        console.print(f"[red]X Task {task_id} not found[/red]")


@app.command()
def delete(task_id: int):
    """Delete a task."""
    manager = TaskManager()
    if manager.delete_task(task_id):
        console.print(f"[green]+ Task {task_id} deleted[/green]")
    else:
        console.print(f"[red]X Task {task_id} not found[/red]")


@app.command()
def update(task_id: int, new_title: str):
    """Update a task's title."""
    manager = TaskManager()
    if manager.update_task(task_id, new_title):
        console.print(f"[green]+ Task {task_id} updated[/green]")
    else:
        console.print(f"[red]X Task {task_id} not found[/red]")


if __name__ == "__main__":
    app()