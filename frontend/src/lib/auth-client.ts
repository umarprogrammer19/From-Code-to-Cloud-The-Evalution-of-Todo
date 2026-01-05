import { useQuery } from '@tanstack/react-query';
import { createAuthClient } from 'better-auth/react';

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'}/api/auth/signin`, {
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

  // Store the token in localStorage if it exists in the response
  if (data.access_token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.access_token);
    }
  }

  return data;
};

// Sign up function
const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'}/api/auth/signup`, {
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

  // Store the token in localStorage if it exists in the response
  if (data.access_token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.access_token);
    }
  }

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

// Decode JWT token to get user info
const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Custom useSession hook that only checks localStorage for the JWT token
export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // Check if we have a token in localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log(token);

        if (!token) {
          return null;
        }

        // Decode the token to get user info and check expiration
        const decoded = decodeToken(token);
        console.log(decoded);

        if (!decoded || !decoded.exp || decoded.exp < Date.now() / 1000) {
          // Token is expired or invalid, remove it
          localStorage.removeItem('auth_token');
          return null;
        }

        // Return a session-like object based on the token
        return {
          user: {
            id: decoded.user_id || decoded.userId || decoded.sub || decoded.id,
            email: decoded.email,
            name: decoded.name,
          },
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
        };
      }

      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Refetch the session when the page is focused (tab switch, window focus)
    refetchOnWindowFocus: true,
    enabled: typeof window !== 'undefined',
  });
};

export { signIn, signOut, signUp };
