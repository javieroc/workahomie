import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WithAuth0Token } from './api/WithAuth0Token';
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate';
import { AuthenticationGuard } from './components';
import { TryHosting, Home, Host, Hosts } from './pages';

const MyRoutes: FC = WithAuth0Token(() => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hosts" element={<Hosts />} />
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
  );
});

const App: FC = () => {
  return (
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <MyRoutes />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
};

export { App };
