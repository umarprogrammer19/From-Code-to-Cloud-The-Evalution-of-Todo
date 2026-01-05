// Task entity - Updated to match our UI requirements
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

// Filter type
export type FilterType = 'all' | 'active' | 'completed';

// Sort type
export type SortType = 'date' | 'priority' | 'title';

// User entity - keeping original structure
export interface Todo {
  id: number; // Backend uses integer IDs
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: number; // Backend uses integer user IDs
}

export interface User {
  id: number; // Backend uses integer IDs
  email: string;
  name?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}