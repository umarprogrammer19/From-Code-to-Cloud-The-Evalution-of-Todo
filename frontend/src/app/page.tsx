'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [session, isPending, router]);

  // Show a loading state while determining where to redirect
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
