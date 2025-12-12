import typer
from rich.table import Table
from rich.console import Console
from rich import print
from rich.panel import Panel
from rich.text import Text
from pyfiglet import Figlet
import questionary
from typing import Optional
from ..core.models import TaskPriority, TaskStatus
from ..core.manager import TaskManager

console = Console()
app = typer.Typer()

def display_banner():
    """Display the welcome banner using figlet."""
    f = Figlet(font='slant')
    banner_text = f.renderText('Todo GenAI')
    console.print(f"[bold blue]{banner_text}[/bold blue]")
    console.print("[italic]Your Interactive Todo List Manager[/italic]\n")

def run_interactive_mode():
    """Run the interactive menu mode."""
    display_banner()

    manager = TaskManager()

    while True:
        # Main menu options
        choice = questionary.select(
            "What would you like to do?",
            choices=[
                {"name": "➕ Add Task", "value": "add"},
                {"name": "📋 List Tasks", "value": "list"},
                {"name": "✅ Complete Task", "value": "complete"},
                {"name": "✏️ Update Task", "value": "update"},
                {"name": "❌ Delete Task", "value": "delete"},
                {"name": "🚪 Exit", "value": "exit"}
            ]
        ).ask()

        if choice == "exit":
            console.print("\n[green]Goodbye![/green]")
            break

        elif choice == "add":
            handle_add_task(manager)

        elif choice == "list":
            handle_list_tasks(manager)

        elif choice == "complete":
            handle_complete_task(manager)

        elif choice == "update":
            handle_update_task(manager)

        elif choice == "delete":
            handle_delete_task(manager)

        # Add a pause before showing the menu again
        console.input("\nPress Enter to continue...")

def handle_add_task(manager: TaskManager):
    """Handle the add task workflow."""
    title = questionary.text("Enter task title:").ask()
    if not title:
        console.print("[red]Task title cannot be empty![/red]")
        return

    priority_choice = questionary.select(
        "Select priority:",
        choices=["Low", "Medium", "High"]
    ).ask()

    priority = TaskPriority[priority_choice.upper()]

    try:
        task = manager.add_task(title, priority)
        console.print(f"[green]✓ Task added with ID {task.id}[/green]")
    except Exception as e:
        console.print(f"[red]✗ Error adding task: {str(e)}[/red]")

def handle_list_tasks(manager: TaskManager):
    """Handle the list tasks workflow."""
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

def handle_complete_task(manager: TaskManager):
    """Handle the complete task workflow."""
    tasks = manager.get_all_tasks()

    pending_tasks = [task for task in tasks if task.status != TaskStatus.DONE]

    if not pending_tasks:
        console.print("[yellow]No pending tasks to complete.[/yellow]")
        return

    task_choices = []
    for task in pending_tasks:
        task_choices.append({
            "name": f"{task.id}: {task.title} ({task.priority.value})",
            "value": task.id
        })

    task_id = questionary.select(
        "Select task to complete:",
        choices=task_choices
    ).ask()

    if task_id:
        if manager.complete_task(task_id):
            console.print(f"[green]✓ Task {task_id} marked as completed[/green]")
        else:
            console.print(f"[red]✗ Task {task_id} not found[/red]")

def handle_update_task(manager: TaskManager):
    """Handle the update task workflow."""
    tasks = manager.get_all_tasks()

    if not tasks:
        console.print("[yellow]No tasks to update.[/yellow]")
        return

    task_choices = []
    for task in tasks:
        status_symbol = "✓" if task.status == TaskStatus.DONE else "○"
        task_choices.append({
            "name": f"{status_symbol} {task.id}: {task.title} ({task.priority.value})",
            "value": task.id
        })

    task_id = questionary.select(
        "Select task to update:",
        choices=task_choices
    ).ask()

    if task_id:
        current_task = manager.get_task_by_id(task_id)
        if current_task:
            new_title = questionary.text("Enter new title:", default=current_task.title).ask()
            if new_title and new_title != current_task.title:
                if manager.update_task(task_id, new_title):
                    console.print(f"[green]✓ Task {task_id} updated[/green]")
                else:
                    console.print(f"[red]✗ Failed to update task {task_id}[/red]")
            else:
                console.print("[yellow]No changes made.[/yellow]")
        else:
            console.print(f"[red]✗ Task {task_id} not found[/red]")

def handle_delete_task(manager: TaskManager):
    """Handle the delete task workflow."""
    tasks = manager.get_all_tasks()

    if not tasks:
        console.print("[yellow]No tasks to delete.[/yellow]")
        return

    task_choices = []
    for task in tasks:
        status_symbol = "✓" if task.status == TaskStatus.DONE else "○"
        task_choices.append({
            "name": f"{status_symbol} {task.id}: {task.title} ({task.priority.value})",
            "value": task.id
        })

    task_id = questionary.select(
        "Select task to delete:",
        choices=task_choices
    ).ask()

    if task_id:
        confirmation = questionary.confirm(f"Are you sure you want to delete task {task_id}?").ask()
        if confirmation:
            if manager.delete_task(task_id):
                console.print(f"[green]✓ Task {task_id} deleted[/green]")
            else:
                console.print(f"[red]✗ Task {task_id} not found[/red]")

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