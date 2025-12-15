
// Function to get the JWT token from better-auth session
export const getJWTToken = async (): Promise<string> => {
  try {
    // For now, we'll implement this differently since getJWT is not available
    // In a real implementation, you would get the token from the session
    // This is a placeholder implementation
    const sessionResponse = await fetch('/api/auth/session');
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      return sessionData?.token || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return '';
  }
};

// Function to get the current user ID from better-auth session
export const getCurrentUserId = (): string => {
  // This will be updated when we get the user session from better-auth
  // For now, we'll return a placeholder
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('current_user_id');
    return userId || '1';
  }
  return '1';
};

// Function to set the current user ID
export const setCurrentUserId = (userId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_user_id', userId);
  }
};