import { useAuth0 } from '@auth0/auth0-react';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Loading } from 'src/components';
import { setupInterceptors } from '.';

const Auth0ProviderWithInterceptor: FC<PropsWithChildren> = ({ children }) => {
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const interceptorsSetup = useRef(false);

  useEffect(() => {
    if (!isLoading && !interceptorsSetup.current) {
      setupInterceptors(getAccessTokenSilently);
      interceptorsSetup.current = true;
    }
  }, [isLoading, getAccessTokenSilently]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};

export { Auth0ProviderWithInterceptor };
