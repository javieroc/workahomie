import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { App } from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
    },
  },
});
const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
