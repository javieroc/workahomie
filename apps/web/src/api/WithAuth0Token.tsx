import { useAuth0 } from '@auth0/auth0-react';
import { FC, useMemo } from 'react';
import { setAuthHeader } from '.';

function WithAuth0Token<P extends JSX.IntrinsicAttributes>(Component: FC<P>) {
  function ComponentWithAuth0Token(props: P) {
    const { getAccessTokenSilently } = useAuth0();

    useMemo(() => {
      async function setTokenToHeaders() {
        const token = await getAccessTokenSilently();
        if (token) {
          setAuthHeader(token);
        }
      }
      setTokenToHeaders();
    }, [getAccessTokenSilently]);

    return <Component {...(props as P)} />;
  }

  return ComponentWithAuth0Token;
}

export { WithAuth0Token };
