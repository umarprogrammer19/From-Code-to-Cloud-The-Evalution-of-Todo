import React from 'react';
import { useSession } from 'better-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/ui/Layout';

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!isPending) {
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [session, isPending, router]);

  return (
    <Layout title="Home">
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Redirecting...</div>
      </div>
    </Layout>
  );
}
