
import { getToken, getUserIdFromToken } from '@/lib/auth-client';

// Function to get the JWT token from auth client
export const getJWTToken = (): string => {
  try {
    // Get the token from our auth client
    return getToken() || '';
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return '';
  }
};

// Function to get the current user ID from auth client
export const getCurrentUserId = (): string => {
  try {
    // Get the user ID from the JWT token
    const userId = getUserIdFromToken();
    return userId?.toString() || '';
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return '';
  }
};

// Function to set the current user ID (not needed since we get it from the token)
export const setCurrentUserId = (userId: string): void => {
  // No longer needed since we decode the user ID from the JWT token
  // This function is kept for compatibility but doesn't do anything
};