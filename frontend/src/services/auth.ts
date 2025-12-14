import { createAuthClient } from 'better-auth/client';
import { createJWT } from 'better-auth/jwt';

// Initialize the auth client
export const authClient = createAuthClient({
  fetch: globalThis.fetch,
});

// Function to get the current session
export const getCurrentSession = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Function to sign in
export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Sign in failed');
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Sign out failed');
    }

    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Function to check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getCurrentSession();
  return !!session && session.user;
};

// Function to get JWT token from cookies or storage
export const getJWTToken = () => {
  // In a real implementation, you'd extract the JWT from cookies or localStorage
  // This is a placeholder implementation
  if (typeof window !== 'undefined') {
    // Extract from document.cookie or localStorage
    const token = localStorage.getItem('auth-token');
    return token || '';
  }
  return '';
};