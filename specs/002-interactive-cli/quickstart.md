# Quickstart Guide: Interactive CLI Todo Application

## Prerequisites

- Python 3.13 or higher
- `uv` package manager (or pip)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies using uv:
   ```bash
   uv sync
   ```

   Or using pip:
   ```bash
   pip install -e .
   ```

## Running the Application

### Interactive Mode
Run without arguments to enter interactive mode:
```bash
todo
```

This will display the main menu with options:
- ➕ Add Task
- 📋 List Tasks
- ✅ Complete Task
- ✏️ Update Task
- ❌ Delete Task
- 🚪 Exit

### Command-Line Mode
Run with arguments to use traditional CLI commands:
```bash
todo add "My new task" --priority High
todo list
todo complete 1
todo update 1 "Updated task title"
todo delete 1
```

## Interactive Mode Workflows

### Adding a Task
1. Select "➕ Add Task" from the menu
2. Enter the task title when prompted
3. Select the priority level (Low, Medium, High)
4. The task will be added with a success message

### Listing Tasks
1. Select "📋 List Tasks" from the menu
2. All tasks will be displayed in a formatted table with ID, Title, Priority, and Status

### Completing a Task
1. Select "✅ Complete Task" from the menu
2. Choose from the list of pending tasks
3. The task status will be updated to "Done"

### Updating a Task
1. Select "✏️ Update Task" from the menu
2. Choose from the list of all tasks
3. Enter the new title (current title shown as default)
4. The task will be updated with the new title

### Deleting a Task
1. Select "❌ Delete Task" from the menu
2. Choose from the list of all tasks
3. Confirm the deletion when prompted
4. The task will be permanently removed

## Command-Line Mode Commands

### Add Task
```bash
todo add "Task title" --priority [Low|Medium|High]
```

### List Tasks
```bash
todo list
```

### Complete Task
```bash
todo complete 1
```

### Update Task
```bash
todo update 1 "New title"
```

### Delete Task
```bash
todo delete 1
```

## Configuration

The application uses `data/tasks.json` for local storage. This file is created automatically in the project directory.

## Troubleshooting

- If the interactive mode doesn't work in your terminal, try running in a different terminal or command prompt
- Make sure all dependencies are installed properly
- Check that you have write permissions to the data directory for task persistence