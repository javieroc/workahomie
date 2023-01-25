import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { App } from './App';

const queryClient = new QueryClient();
const rootElement = document.getElementById('root') as HTMLElement;

const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? '';

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
