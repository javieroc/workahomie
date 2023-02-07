import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';
import { setAuthHeader } from '.';

function useAuthorizedApiCall() {
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
}

export { useAuthorizedApiCall };
