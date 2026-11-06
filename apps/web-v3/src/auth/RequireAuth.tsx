import { useEffect, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useSession } from './useSession';
import { authConfigured } from './AuthProvider';

export function RequireAuth({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, login } = useSession();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && authConfigured)
      void login(location.pathname + location.search);
  }, [isLoading, isAuthenticated, login, location]);

  if (!authConfigured) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Sign-in isn’t configured</h1>
        <p className="mt-2 text-muted">Set the VITE_AUTH0_* variables to use this page.</p>
      </div>
    );
  }
  if (isLoading || !isAuthenticated) return <FullPageSpinner label="Signing you in…" />;
  return children;
}
