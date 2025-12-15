'use client';

import React, { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

interface BetterAuthSessionProviderProps {
  children: ReactNode;
}

// Custom Session Provider that wraps the auth client provider
const BetterAuthSessionProvider: React.FC<BetterAuthSessionProviderProps> = ({ children }) => {
  // In better-auth, the client itself might provide the provider functionality
  // This is a wrapper that ensures session context is available to children
  return (
    <authClient.Provider>
      {children}
    </authClient.Provider>
  );
};

export default BetterAuthSessionProvider;