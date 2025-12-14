import React from 'react';
import { useSession } from 'better-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  // If still checking session, show loading state or nothing
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If no session, redirect to login
  if (!session) {
    // For App Router, we use redirect from next/navigation
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null; // This won't be reached due to redirect
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;