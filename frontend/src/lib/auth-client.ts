import { createAuthClient } from 'better-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetch: globalThis.fetch,
});

// Export the hooks and functions
export const { useSession, signIn, signOut, signUp } = authClient;