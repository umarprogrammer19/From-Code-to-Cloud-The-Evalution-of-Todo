'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Todo App</h1>
          <nav>
            {session ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Streamline Your Tasks, Amplify Your Productivity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            A beautifully designed todo application that helps you organize your tasks efficiently and achieve your goals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Todo App. All rights reserved.
      </footer>
    </div>
  );
}
