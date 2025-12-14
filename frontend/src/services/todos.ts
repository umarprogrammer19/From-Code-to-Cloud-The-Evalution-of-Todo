import { Todo } from '@/types';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const TODO_ENDPOINT = '/api/todos';

// Get all todos for the current user
export const getTodos = async (): Promise<Todo[]> => {
  return await apiGet<Todo[]>(TODO_ENDPOINT);
};

// Get a specific todo by ID
export const getTodoById = async (id: string): Promise<Todo> => {
  return await apiGet<Todo>(`${TODO_ENDPOINT}/${id}`);
};

// Create a new todo
export const createTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Todo> => {
  return await apiPost<Todo>(TODO_ENDPOINT, todoData);
};

// Update an existing todo
export const updateTodo = async (id: string, todoData: Partial<Todo>): Promise<Todo> => {
  return await apiPut<Todo>(`${TODO_ENDPOINT}/${id}`, todoData);
};

// Toggle todo completion status
export const toggleTodoCompletion = async (id: string, completed: boolean): Promise<Todo> => {
  return await apiPut<Todo>(`${TODO_ENDPOINT}/${id}/toggle`, { completed });
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  await apiDelete(`${TODO_ENDPOINT}/${id}`);
};

// Get todo statistics
export const getTodoStats = async (): Promise<{ total: number; completed: number; active: number }> => {
  return await apiGet<{ total: number; completed: number; active: number }>(`${TODO_ENDPOINT}/stats`);
};