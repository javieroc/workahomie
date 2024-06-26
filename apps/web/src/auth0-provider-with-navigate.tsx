import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithNavigate: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? '';

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || '/');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: `${window.location.origin}/workahomie/`,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export { Auth0ProviderWithNavigate };
