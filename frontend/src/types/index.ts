export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
}

export interface User {
  id: string;
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