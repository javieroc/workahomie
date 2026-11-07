import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';
import { authConfigured } from './AuthProvider';

/** Thin wrapper over Auth0 that also works when auth isn't configured (local dev, previews). */
export function useSession() {
  const auth = useAuth0();
  const configured = authConfigured;
  const userId = auth.user?.sub?.split('|')[1];

  const { loginWithRedirect, logout: auth0Logout } = auth;
  const login = useCallback(
    (returnTo = window.location.pathname + window.location.search) =>
      configured ? loginWithRedirect({ appState: { returnTo } }) : Promise.resolve(),
    [loginWithRedirect, configured],
  );

  const logout = useCallback(
    () =>
      configured
        ? auth0Logout({ logoutParams: { returnTo: window.location.origin } })
        : Promise.resolve(),
    [auth0Logout, configured],
  );

  const { getAccessTokenSilently } = auth;
  const getToken = useCallback(
    (): Promise<string | undefined> => getAccessTokenSilently(),
    [getAccessTokenSilently],
  );

  return {
    isAuthenticated: configured && auth.isAuthenticated,
    isLoading: configured && auth.isLoading,
    user: auth.user,
    userId,
    login,
    logout,
    getToken,
  };
}
