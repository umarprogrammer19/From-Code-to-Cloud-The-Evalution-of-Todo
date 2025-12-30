'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';

// Create a single instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface BetterAuthSessionProviderProps {
  children: ReactNode;
}

// Custom Session Provider that wraps the auth client provider
const BetterAuthSessionProvider: React.FC<BetterAuthSessionProviderProps> = ({ children }) => {
  // In better-auth, the client itself might provide the provider functionality
  // This is a wrapper that ensures session context is available to children
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default BetterAuthSessionProvider;