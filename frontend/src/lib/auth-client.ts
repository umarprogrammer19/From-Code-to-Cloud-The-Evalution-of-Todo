import { createAuthClient } from 'better-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Create better-auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Define types
interface User {
  id: number;
  email: string;
  name?: string;
}

interface SessionData {
  user: User;
  expiresAt: string;
}

// Sign in function
const signIn = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Sign in failed');
  }

  const data = await response.json();
  return data;
};

// Sign up function
const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Sign up failed');
  }

  const data = await response.json();
  return data;
};

// Sign out function
const signOut = async () => {
  // Call the backend sign out endpoint
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Sign out failed');
  }

  // Clear any local storage or cookies as needed
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Custom useSession hook that follows React Query patterns
export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // Check if we have a token in localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          return null;
        }
      }

      // Fetch session data from the backend
      const response = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        // If the token is invalid or expired, return null
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
          return null;
      }

      const sessionData = await response.json();
      return sessionData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // This ensures the query is only run when the component is mounted
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
  });
};

export { signIn, signOut, signUp };