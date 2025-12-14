import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useSession } from 'better-auth/react';
import { signIn as betterAuthSignIn, signOut as betterAuthSignOut } from 'better-auth/react';
import { getCurrentSession } from '@/services/auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, isPending, isError } = useSession();

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [session, isPending, isError]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await betterAuthSignIn('credentials', {
        email,
        password,
      });
      // The session will be updated automatically by better-auth
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await betterAuthSignOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};