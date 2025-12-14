import React from 'react';
import { useSession } from 'better-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/ui/Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Component to show while loading or redirecting
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = (
    <Layout title="Loading">
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    </Layout>
  )
}) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // If still checking session, show loading state
  if (isPending) {
    return fallback;
  }

  // If no session, redirect to login
  if (!session) {
    // Redirect to login with return URL
    router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    return fallback;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;