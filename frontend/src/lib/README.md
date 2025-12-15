# Authentication Client Configuration

This directory contains the authentication client configuration for better-auth.

## auth-client.ts
This file initializes the better-auth client with the proper backend endpoint and exports the necessary hooks and functions:

- `authClient`: The configured better-auth client instance
- `useSession`: Hook to access session data
- `signIn`: Function to sign in users
- `signOut`: Function to sign out users
- `signUp`: Function to sign up users
- `getJWT`: Function to retrieve JWT tokens

## Environment Variables
The client uses `NEXT_PUBLIC_API_URL` to determine the backend endpoint, defaulting to `http://localhost:8000` if not set.