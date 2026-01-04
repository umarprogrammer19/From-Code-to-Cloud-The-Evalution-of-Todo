import { Todo } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

// Get all tasks for the current user
export const getTodos = async (): Promise<Todo[]> => {
  const endpoint = `/api/tasks`;
  return await apiGet<Todo[]>(endpoint);
};

// Get a specific task by ID
export const getTodoById = async (id: string): Promise<Todo> => {
  const endpoint = `/api/tasks/${id}`;
  return await apiGet<Todo>(endpoint);
};

// Create a new task
export const createTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Todo> => {
  const endpoint = `/api/tasks`;
  return await apiPost<Todo>(endpoint, todoData);
};

// Update an existing task
export const updateTodo = async (id: string, todoData: Partial<Todo>): Promise<Todo> => {
  const endpoint = `/api/tasks/${id}`;
  return await apiPut<Todo>(endpoint, todoData);
};

// Toggle task completion status
export const toggleTodoCompletion = async (id: string, completed: boolean): Promise<Todo> => {
  // Update the task with the completion status
  const endpoint = `/api/tasks/${id}`;
  return await apiPut<Todo>(endpoint, { completed });
};

// Delete a task
export const deleteTodo = async (id: string): Promise<void> => {
  const endpoint = `/api/tasks/${id}`;
  await apiDelete(endpoint);
};

// Get task statistics
export const getTodoStats = async (): Promise<{ total: number; completed: number; active: number }> => {
  // For now, we'll calculate stats client-side since the backend doesn't have a stats endpoint
  const tasks = await getTodos();
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;

  return { total, completed, active };
};