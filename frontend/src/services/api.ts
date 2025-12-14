import { getJWTToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, retries = 3 } = options;

    // Get JWT token and add to headers
    const token = getJWTToken();
    const authHeaders: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
      credentials: 'include', // Include cookies for session management
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    let lastError: Error | null = null;

    // Retry mechanism
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        // Handle 401 unauthorized responses
        if (response.status === 401) {
          // Optionally redirect to login or clear auth state
          console.warn('Unauthorized access - redirect to login may be needed');
          // You might want to redirect the user to login here
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.detail || `HTTP error! status: ${response.status}`);

          // Don't retry on 4xx errors (client errors)
          if (response.status >= 400 && response.status < 500) {
            throw error;
          }

          lastError = error;

          // If this is the last attempt, throw the error
          if (attempt === retries) {
            throw error;
          }

          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        // For successful responses that have content
        if (response.status !== 204) { // 204 No Content
          return await response.json();
        }

        // For 204 responses, return empty object
        return {} as T;
      } catch (error) {
        lastError = error as Error;

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          console.error(`API request failed after ${retries + 1} attempts: ${method} ${endpoint}`, error);
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // This should never be reached due to the throws above, but TypeScript requires it
    throw lastError || new Error('Request failed');
  }

  get<T>(endpoint: string, headers?: Record<string, string>, retries: number = 3): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers, retries });
  }

  post<T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers, retries });
  }

  put<T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers, retries });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>, retries: number = 3): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers, retries });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const apiGet = <T>(endpoint: string, headers?: Record<string, string>, retries: number = 3) =>
  apiClient.get<T>(endpoint, headers, retries);

export const apiPost = <T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3) =>
  apiClient.post<T>(endpoint, body, headers, retries);

export const apiPut = <T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3) =>
  apiClient.put<T>(endpoint, body, headers, retries);

export const apiDelete = <T>(endpoint: string, headers?: Record<string, string>, retries: number = 3) =>
  apiClient.delete<T>(endpoint, headers, retries);