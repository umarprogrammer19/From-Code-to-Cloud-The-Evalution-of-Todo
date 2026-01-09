# Data Model: Modern UI/UX Components

## Component Entities

### Task Entity
- **Type**: `Task`
- **Fields**:
  - `id`: string (unique identifier)
  - `title`: string (task title)
  - `description`: string (optional task description)
  - `completed`: boolean (completion status)
  - `priority`: 'low' | 'medium' | 'high' (priority level)
  - `createdAt`: Date (creation timestamp)
  - `updatedAt`: Date (last update timestamp)
  - `dueDate`: Date (optional due date)

### User Entity
- **Type**: `User`
- **Fields**:
  - `id`: string (unique identifier)
  - `name`: string (user display name)
  - `email`: string (user email)
  - `theme`: 'light' | 'dark' (preferred theme setting)
  - `preferences`: object (user preferences)

### Filter Entity
- **Type**: `FilterType`
- **Values**:
  - `all`: Show all tasks
  - `active`: Show only incomplete tasks
  - `completed`: Show only completed tasks

### Sort Entity
- **Type**: `SortType`
- **Values**:
  - `date`: Sort by creation/update date
  - `priority`: Sort by priority level
  - `title`: Sort by title alphabetically

## Component State Models

### TaskCard State
- **Props**:
  - `task`: Task (the task object to display)
  - `onComplete`: (task: Task) => void (callback for task completion)
  - `onDelete`: (task: Task) => void (callback for task deletion)
  - `isAnimating`: boolean (animation state for completion)

### FilterDropdown State
- **Props**:
  - `currentFilter`: FilterType (currently selected filter)
  - `onFilterChange`: (filter: FilterType) => void (callback for filter change)

### SortDropdown State
- **Props**:
  - `currentSort`: SortType (currently selected sort)
  - `onSortChange`: (sort: SortType) => void (callback for sort change)

### Sidebar State
- **Props**:
  - `activeItem`: string (currently selected navigation item)
  - `onNavigate`: (path: string) => void (callback for navigation)

### TopNav State
- **Props**:
  - `user`: User (current user data)
  - `onThemeToggle`: () => void (callback for theme switching)
  - `onLogout`: () => void (callback for logout)

## UI State Management

### Theme Context
- **State**: `theme: 'light' | 'dark'`
- **Actions**:
  - `setTheme(theme: 'light' | 'dark')`
  - `toggleTheme()`

### Task List Context
- **State**: `tasks: Task[]`, `filter: FilterType`, `sort: SortType`
- **Actions**:
  - `addTask(task: Omit<Task, 'id'>)`
  - `updateTask(id: string, updates: Partial<Task>)`
  - `deleteTask(id: string)`
  - `setFilter(filter: FilterType)`
  - `setSort(sort: SortType)`

## Validation Rules

### Task Validation
- Title must be 1-200 characters
- Description optional, max 1000 characters
- Priority must be one of 'low', 'medium', 'high'
- Due date must be in the future (if provided)

### User Validation
- Name must be 1-100 characters
- Email must be valid email format
- Theme must be 'light' or 'dark'