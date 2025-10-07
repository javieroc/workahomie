import { useAuth0 } from '@auth0/auth0-react';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Loading } from 'src/components';
import { setupInterceptors } from '.';

const Auth0ProviderWithInterceptor: FC<PropsWithChildren> = ({ children }) => {
  const { getAccessTokenSilently, isLoading, logout } = useAuth0();
  const [interceptorReady, setInterceptorReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setupInterceptors(getAccessTokenSilently, () =>
        logout({ logoutParams: { returnTo: `${window.location.origin}/workahomie/` } }),
      );
      setInterceptorReady(true);
    }
  }, [isLoading, getAccessTokenSilently, logout]);

  if (isLoading || !interceptorReady) {
    return <Loading />;
  }

  return children;
};

export { Auth0ProviderWithInterceptor };
