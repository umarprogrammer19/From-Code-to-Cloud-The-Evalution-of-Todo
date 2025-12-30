
// Function to get the JWT token from localStorage
export const getJWTToken = (): string => {
  try {
    // Get the token from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return '';
  }
};

// Function to get the current user ID from auth client
export const getCurrentUserId = (): string => {
  try {
    // Get the token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) return '';

      // Decode the JWT token to get the user ID
      try {
        // Split the JWT token to get the payload
        const base64Url = token.split('.')[1];
        if (!base64Url) return '';

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
        return (payload.userId || payload.sub || '').toString();
      } catch (decodeError) {
        console.error('Error decoding JWT token:', decodeError);
        return '';
      }
    }
    return '';
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