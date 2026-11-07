import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { Layout } from './components/layout/Layout';
import { FullPageSpinner } from './components/ui/Spinner';
import HomePage from './pages/home/HomePage';

const ExplorePage = lazy(() => import('./pages/explore/ExplorePage'));
const HostPage = lazy(() => import('./pages/host/HostPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const BecomeHostPage = lazy(() => import('./pages/dashboard/BecomeHostPage'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const RequestsPage = lazy(() => import('./pages/dashboard/RequestsPage'));
const SavedPage = lazy(() => import('./pages/dashboard/SavedPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const PlacePage = lazy(() => import('./pages/dashboard/PlacePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

const page = (node: ReactNode) => <Suspense fallback={<FullPageSpinner />}>{node}</Suspense>;

function Root() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: page(<ExplorePage />) },
      { path: 'hosts/:hostId', element: page(<HostPage />) },
      { path: 'how-it-works', element: page(<HowItWorksPage />) },
      { path: 'become-a-host', element: page(<BecomeHostPage />) },
      {
        path: 'me',
        element: page(
          <RequireAuth>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </RequireAuth>,
        ),
        children: [
          { index: true, element: page(<RequestsPage />) },
          { path: 'requests', element: page(<RequestsPage />) },
          { path: 'requests/:requestId', element: page(<RequestsPage />) },
          { path: 'saved', element: page(<SavedPage />) },
          { path: 'profile', element: page(<ProfilePage />) },
          { path: 'place', element: page(<PlacePage />) },
        ],
      },
      { path: '*', element: page(<NotFoundPage />) },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ style: { borderRadius: 18 } }}
      />
    </QueryClientProvider>
  );
}
