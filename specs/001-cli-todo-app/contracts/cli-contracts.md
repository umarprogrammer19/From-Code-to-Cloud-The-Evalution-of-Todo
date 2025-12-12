# CLI Todo App API Contracts

## Command: Add Task
- **Command**: `todo add <title> --priority <priority>`
- **Arguments**:
  - `title` (str): Task title (required, min length: 1)
- **Options**:
  - `--priority` (str): Priority level (enum: "Low", "Medium", "High"; default: "Medium")
- **Behavior**: Creates a new task with unique ID and "Pending" status
- **Success Response**: Green success message with assigned task ID
- **Error Response**: Red error message if validation fails

## Command: List Tasks
- **Command**: `todo list`
- **Arguments**: None
- **Options**: None
- **Behavior**: Displays all tasks in a rich formatted table with columns: ID, Title, Priority, Status
- **Success Response**: Rich table with all tasks or appropriate message if empty
- **Error Response**: Red error message if file I/O fails

## Command: Complete Task
- **Command**: `todo complete <id>`
- **Arguments**:
  - `id` (int): Task identifier
- **Options**: None
- **Behavior**: Updates task status from "Pending" to "Done"
- **Success Response**: Green success message confirming completion
- **Error Response**: Red error message if task ID not found

## Command: Delete Task
- **Command**: `todo delete <id>`
- **Arguments**:
  - `id` (int): Task identifier
- **Options**: None
- **Behavior**: Removes task from collection
- **Success Response**: Green success message confirming deletion
- **Error Response**: Red error message if task ID not found

## Command: Update Task
- **Command**: `todo update <id> <new_title>`
- **Arguments**:
  - `id` (int): Task identifier
  - `new_title` (str): New task title (required, min length: 1)
- **Options**: None
- **Behavior**: Updates task title while preserving other attributes
- **Success Response**: Green success message confirming update
- **Error Response**: Red error message if task ID not found

## Data Contracts

### Task Data Model
- `id` (int): Unique identifier
- `title` (str): Task title (min length: 1)
- `priority` (str): Priority level ("Low", "Medium", "High")
- `status` (str): Current status ("Pending", "Done")
- `created_at` (datetime): Creation timestamp
- `completed_at` (datetime | null): Completion timestamp

### Storage Contract
- **File**: `data/tasks.json`
- **Format**: JSON with "tasks" array containing Task objects
- **Initialization**: Creates empty collection if file doesn't exist