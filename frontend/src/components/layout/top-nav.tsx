'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function TopNav() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="text-lg font-semibold">Dashboard</div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="mr-2">User Profile</span>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}