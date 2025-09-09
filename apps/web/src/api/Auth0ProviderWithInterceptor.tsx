import { useAuth0 } from '@auth0/auth0-react';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Loading } from 'src/components';
import { setupInterceptors } from '.';

const Auth0ProviderWithInterceptor: FC<PropsWithChildren> = ({ children }) => {
  const { getAccessTokenSilently, isLoading, logout } = useAuth0();
  const interceptorsSetup = useRef(false);

  useEffect(() => {
    if (!isLoading && !interceptorsSetup.current) {
      setupInterceptors(getAccessTokenSilently, () =>
        logout({ logoutParams: { returnTo: `${window.location.origin}/workahomie/` } }),
      );
      interceptorsSetup.current = true;
    }
  }, [isLoading, getAccessTokenSilently, logout]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};

export { Auth0ProviderWithInterceptor };
