# 002-interactive-cli: Interactive CLI Mode Specification

## Overview
This specification defines the requirements for implementing an interactive mode for the CLI Todo application. The application should support both traditional command-line interface and an interactive menu-driven interface.

## Requirements

### 1. Entry Point Enhancement
- When the application is run without arguments (`todo`), it should launch in interactive mode
- When arguments are provided (`todo add "task"`), it should use traditional CLI mode
- Display a specialized "Welcome to Todo GenAI" banner using `rich.figlet` when entering interactive mode

### 2. Main Menu System
- Implement a main menu using `questionary` with the following options:
  - "➕ Add Task" - Add a new task
  - "📋 List Tasks" - Display all tasks in a formatted table
  - "✅ Complete Task" - Mark a task as completed
  - "✏️ Update Task" - Update a task's title
  - "❌ Delete Task" - Delete a task
  - "🚪 Exit" - Exit the application

### 3. Interactive Workflows

#### 3.1 Add Task Workflow
- Prompt user for task title using `questionary.text()`
- Prompt user for priority using `questionary.select()` with options: "Low", "Medium", "High"
- Display success/error messages using rich colors

#### 3.2 List Tasks Workflow
- Display all tasks in the same rich table format as the current CLI
- Show ID, Title, Priority, and Status columns

#### 3.3 Complete Task Workflow
- Show a list of pending tasks for selection (not completed tasks)
- Use `questionary.select()` to let user choose from existing tasks
- Display task ID, title, and priority for selection
- Show success/error messages using rich colors

#### 3.4 Update Task Workflow
- Show a list of all tasks for selection
- Display current task details for context
- Allow user to enter new title with current title as default
- Show success/error messages using rich colors

#### 3.5 Delete Task Workflow
- Show a list of all tasks for selection
- Ask for confirmation before deletion using `questionary.confirm()`
- Show success/error messages using rich colors

### 4. UI/UX Requirements
- Use `rich` library for consistent color scheme and formatting
- Maintain same success/error color coding as current implementation
- Add a pause mechanism to allow user to read messages before returning to menu
- Ensure the menu loops continuously until "Exit" is selected

### 5. Dependencies
- Add `questionary>=2.0.0` for interactive prompts
- Add `pyfiglet>=1.0.4` for banner text rendering

## Backward Compatibility
- All existing CLI commands must continue to work unchanged
- Command format should remain the same
- Data models and storage should remain unchanged

## Success Criteria
1. Application launches in interactive mode when run without arguments
2. All menu options work correctly with proper input validation
3. Rich banner displays correctly
4. All existing CLI functionality remains intact
5. Error handling is consistent with current implementation
6. User experience is intuitive and smooth

## Acceptance Tests
- [ ] `todo` command launches interactive mode with banner
- [ ] All menu options are accessible and functional
- [ ] Add task workflow works with title and priority selection
- [ ] List tasks shows all tasks in table format
- [ ] Complete task allows selection from pending tasks only
- [ ] Update task allows selection and title update
- [ ] Delete task has confirmation dialog
- [ ] Exit option terminates the application
- [ ] Command-line interface still works with arguments like `todo add "task"`
- [ ] All operations provide appropriate success/error feedback