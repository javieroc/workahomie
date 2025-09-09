import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate';
import { AuthenticationGuard } from './components';
import { TryHosting, Home, Host, Hosts, HowItWorks } from './pages';
import { Auth0ProviderWithInterceptor } from './api/Auth0ProviderWithInterceptor';

const App: FC = () => {
  return (
    <BrowserRouter basename="/workahomie/">
      <Auth0ProviderWithNavigate>
        <Auth0ProviderWithInterceptor>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hosts/*" element={<Hosts />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/try-hosting" element={<AuthenticationGuard component={TryHosting} />} />
            <Route path="/host/*" element={<AuthenticationGuard component={Host} />} />
            <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>Not found</p>
                </main>
              }
            />
          </Routes>
        </Auth0ProviderWithInterceptor>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
};

export { App };
