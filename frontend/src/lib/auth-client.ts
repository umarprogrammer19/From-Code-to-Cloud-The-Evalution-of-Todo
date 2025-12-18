// Custom auth client implementation that works with Next.js API routes
// Using JWT-based authentication with Next.js API routes

// Store the JWT token in localStorage
const TOKEN_KEY = 'auth_token';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface Session {
  user: User | null;
  loading: boolean;
}

// Mock session state - in a real implementation, you'd use React context or similar
let currentSession: Session = { user: null, loading: false };

// Function to get token from storage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Function to set token in storage
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Function to remove token from storage
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Function to decode JWT and get user ID
const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;

  try {
    // Split the JWT token to get the payload
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // Replace URL-safe base64 chars with standard base64 chars
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the base64 string to get the JSON payload
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    return payload.userId || payload.sub || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Sign in function that communicates with Next.js API routes
const signIn = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch('/api/auth/signin', { // Use Next.js API route
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

    // Store the JWT token
    if (data.token) {
      setToken(data.token);

      // Update session with user info
      const userId = getUserIdFromToken();
      currentSession = {
        user: {
          id: userId || data.user.id, // fallback to data.user.id if we can't decode token
          email: data.user.email,
          name: data.user.name
        },
        loading: false
      };
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign out function
const signOut = async (): Promise<void> => {
  try {
    removeToken();
    currentSession = { user: null, loading: false };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get session function
const useSession = (): Session => {
  // In a real implementation, you'd use React context to manage this state
  // For now, we'll return a simple object
  if (!currentSession.user && getToken()) {
    // Token exists but no user loaded, try to get user info from token
    const userId = getUserIdFromToken();
    if (userId) {
      // Since we don't have user details in the token, we'll need to get them separately
      // For now, we'll just set the ID and assume the email is unknown
      currentSession = {
        user: { id: userId, email: 'user@example.com' }, // Email would need to be stored separately
        loading: false
      };
    }
  }

  return currentSession;
};

// Sign up function that communicates with Next.js API routes
const signUp = async (email: string, password: string, name?: string): Promise<any> => {
  try {
    const response = await fetch('/api/auth/signup', { // Use Next.js API route
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

    // Store the JWT token
    if (data.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export { useSession, signIn, signOut, signUp, getToken, getUserIdFromToken };