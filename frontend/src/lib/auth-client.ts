import { createAuthClient } from 'better-auth/react';

// Initialize the auth client with your backend endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetch: globalThis.fetch,
});

// Export the hooks and functions
export const { useSession, signIn, signOut, signUp } = authClient;