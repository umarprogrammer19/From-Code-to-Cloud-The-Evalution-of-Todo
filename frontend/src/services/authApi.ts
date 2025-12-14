import { getValidAuthToken } from './authUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
}

class AuthApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, retries = 3 } = options;

    let lastError: Error | null = null;

    // Retry mechanism with token refresh
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Get a valid token (refreshes if needed)
        const token = await getValidAuthToken();

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

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        // Handle 401 unauthorized responses - might need to refresh token
        if (response.status === 401) {
          // Clear the potentially expired token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
          }

          // Try to get a new token and retry the request
          if (attempt < retries) {
            const newToken = await getValidAuthToken();
            if (newToken) {
              // Retry the request with the new token
              continue;
            }
          }

          // If token refresh failed, redirect to login
          console.warn('Unauthorized access - redirect to login may be needed');
          // You might want to redirect the user to login here
          throw new Error('Authentication required');
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
export const authApiClient = new AuthApiClient(API_BASE_URL);

// Export individual methods for convenience
export const authApiGet = <T>(endpoint: string, headers?: Record<string, string>, retries: number = 3) =>
  authApiClient.get<T>(endpoint, headers, retries);

export const authApiPost = <T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3) =>
  authApiClient.post<T>(endpoint, body, headers, retries);

export const authApiPut = <T>(endpoint: string, body?: any, headers?: Record<string, string>, retries: number = 3) =>
  authApiClient.put<T>(endpoint, body, headers, retries);

export const authApiDelete = <T>(endpoint: string, headers?: Record<string, string>, retries: number = 3) =>
  authApiClient.delete<T>(endpoint, headers, retries);