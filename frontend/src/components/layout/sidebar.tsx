'use client';

import { Home, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Tasks', href: '/dashboard', icon: Home },
    { name: 'Categories', href: '/dashboard/categories', icon: Plus },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-full border-r p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Todo App</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${isActive ? 'bg-muted' : ''}`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto">
        <Button variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}