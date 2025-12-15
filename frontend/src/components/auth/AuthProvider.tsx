'use client';

import React, { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

interface AuthProviderProps {
  children: ReactNode;
}

// Better Auth Provider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // The auth client handles session management automatically
  return (
    <authClient.Provider>
      {children}
    </authClient.Provider>
  );
};

export default AuthProvider;