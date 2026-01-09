'use client';

import React from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from './button';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Todo App' }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh(); // Refresh to update the session context
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {session?.user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {session.user.name || session.user.email}</span>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;