import { getJWTToken } from './auth';

// Function to check if JWT token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    // Split the token to get the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if the token has expired (exp is in seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume token is expired
  }
};

// Function to refresh JWT token
export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Function to get valid JWT token (refresh if needed)
export const getValidAuthToken = async (): Promise<string | null> => {
  // Get token using the existing function
  const token = getJWTToken();

  if (!token) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Try to refresh the token
    const newToken = await refreshAuthToken();
    if (newToken) {
      // Store the new token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', newToken);
      }
      return newToken;
    } else {
      // If refresh failed, clear the old token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
      return null;
    }
  }

  return token;
};