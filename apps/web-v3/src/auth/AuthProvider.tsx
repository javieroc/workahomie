import { Auth0Provider, useAuth0, type AppState } from '@auth0/auth0-react';
import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';
import { setTokenGetter } from '@/lib/api';
import { env } from '@/lib/env';

export const authConfigured = Boolean(env.auth0Domain && env.auth0ClientId);

function AuthBridge({ children }: PropsWithChildren) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setTokenGetter(isAuthenticated ? () => getAccessTokenSilently() : null);
    return () => setTokenGetter(null);
  }, [isAuthenticated, getAccessTokenSilently]);

  return children;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  if (!authConfigured) {
    // eslint-disable-next-line no-console
    if (import.meta.env.DEV) console.warn('[auth] VITE_AUTH0_* not set — running anonymously');
    return children;
  }

  return (
    <Auth0Provider
      domain={env.auth0Domain}
      clientId={env.auth0ClientId}
      authorizationParams={{ audience: env.auth0Audience, redirect_uri: window.location.origin }}
      useRefreshTokens
      cacheLocation="localstorage"
      onRedirectCallback={(state?: AppState) => navigate(state?.returnTo ?? '/', { replace: true })}
    >
      <AuthBridge>{children}</AuthBridge>
    </Auth0Provider>
  );
}
