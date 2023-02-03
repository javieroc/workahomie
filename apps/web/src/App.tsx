import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate';
import { AuthenticationGuard } from './components';
import { BecomeAHost, Home } from './pages';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/try-hosting" element={<AuthenticationGuard component={BecomeAHost} />} />
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>Not found</p>
              </main>
            }
          />
        </Routes>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
};

export { App };
