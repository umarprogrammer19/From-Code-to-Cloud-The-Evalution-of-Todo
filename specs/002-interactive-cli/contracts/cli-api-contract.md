# CLI API Contract: Interactive Todo Application

## Command Structure

The CLI application follows the Typer convention with subcommands:

```
todo [COMMAND] [OPTIONS] [ARGUMENTS...]
```

## Commands

### 1. Add Task
```
todo add [TITLE] [--priority PRIORITY]
```

**Description**: Add a new task to the todo list

**Parameters**:
- `title` (str, required): The task description
- `priority` (enum, optional): Task priority [Low, Medium, High], default: Medium

**Success Response**:
- Exit code: 0
- Output: `[green]+ Task added with ID {task_id}[/green]`

**Error Response**:
- Exit code: 1
- Output: `[red]Error message[/red]`

### 2. List Tasks
```
todo list
```

**Description**: Display all tasks in a formatted table

**Parameters**: None

**Success Response**:
- Exit code: 0
- Output: Rich table with columns [ID, Title, Priority, Status]

**Error Response**: None (empty list shows "No tasks found")

### 3. Complete Task
```
todo complete [TASK_ID]
```

**Description**: Mark a task as completed

**Parameters**:
- `task_id` (int, required): The ID of the task to complete

**Success Response**:
- Exit code: 0
- Output: `[green]+ Task {task_id} marked as completed[/green]`

**Error Response**:
- Exit code: 1
- Output: `[red]X Task {task_id} not found[/red]`

### 4. Update Task
```
todo update [TASK_ID] [NEW_TITLE]
```

**Description**: Update a task's title

**Parameters**:
- `task_id` (int, required): The ID of the task to update
- `new_title` (str, required): The new title for the task

**Success Response**:
- Exit code: 0
- Output: `[green]+ Task {task_id} updated[/green]`

**Error Response**:
- Exit code: 1
- Output: `[red]X Task {task_id} not found[/red]`

### 5. Delete Task
```
todo delete [TASK_ID]
```

**Description**: Delete a task from the list

**Parameters**:
- `task_id` (int, required): The ID of the task to delete

**Success Response**:
- Exit code: 0
- Output: `[green]+ Task {task_id} deleted[/green]`

**Error Response**:
- Exit code: 1
- Output: `[red]X Task {task_id} not found[/red]`

## Interactive Mode Contract

When no arguments are provided (`todo`), the application enters interactive mode:

```
todo
```

**Description**: Launch interactive menu system

**Entry Point**:
- Display "Welcome to Todo GenAI" banner using figlet
- Show main menu with options:
  - "➕ Add Task"
  - "📋 List Tasks"
  - "✅ Complete Task"
  - "✏️ Update Task"
  - "❌ Delete Task"
  - "🚪 Exit"

**Behavior**:
- Continuously display menu until "Exit" is selected
- Each menu option triggers a specific workflow
- All user interactions use `questionary` prompts
- All messages use `rich` formatting

### Interactive Workflows

#### Add Task Workflow
**Trigger**: User selects "➕ Add Task"

**Steps**:
1. Prompt for task title using `questionary.text()`
2. Prompt for priority using `questionary.select()` with options [Low, Medium, High]
3. Call TaskManager.add_task() with provided parameters
4. Display success/error message using rich colors

#### List Tasks Workflow
**Trigger**: User selects "📋 List Tasks"

**Steps**:
1. Call TaskManager.get_all_tasks()
2. Display tasks in rich table format with ID, Title, Priority, Status columns
3. If no tasks exist, display "No tasks found" message

#### Complete Task Workflow
**Trigger**: User selects "✅ Complete Task"

**Steps**:
1. Get all pending tasks from TaskManager
2. Present list of pending tasks for selection using `questionary.select()`
3. Call TaskManager.complete_task() with selected task ID
4. Display success/error message using rich colors

#### Update Task Workflow
**Trigger**: User selects "✏️ Update Task"

**Steps**:
1. Get all tasks from TaskManager
2. Present list of all tasks for selection using `questionary.select()`
3. Prompt for new title with current title as default using `questionary.text()`
4. Call TaskManager.update_task() with selected task ID and new title
5. Display success/error message using rich colors

#### Delete Task Workflow
**Trigger**: User selects "❌ Delete Task"

**Steps**:
1. Get all tasks from TaskManager
2. Present list of all tasks for selection using `questionary.select()`
3. Ask for confirmation using `questionary.confirm()`
4. If confirmed, call TaskManager.delete_task() with selected task ID
5. Display success/error message using rich colors

## Data Contract

### Input Validation
- Task title: Required, minimum 1 character
- Task ID: Required, integer, must exist in collection
- Priority: Enum, one of [Low, Medium, High]

### Output Format
- Success messages: Green color using rich
- Error messages: Red color using rich
- Tables: Rich table format with specific column structure
- Banner: Figlet text with blue color

## Error Handling

### Expected Errors
- Task not found (invalid ID)
- Invalid priority value
- Empty task title
- File I/O errors (for persistence)

### Error Responses
- Non-zero exit codes for CLI commands
- User-friendly error messages with rich formatting
- Graceful handling of file access issues
- Validation errors with clear guidance