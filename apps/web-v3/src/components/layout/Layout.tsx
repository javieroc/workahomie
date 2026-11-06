import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { AndroidBanner } from './AndroidBanner';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

function DonationToast() {
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const status = params.get('donation');
    if (!status) return;
    if (status === 'success') toast.success('Thank you for supporting Workahomies 💜');
    else toast('Donation cancelled');
    params.delete('donation');
    setParams(params, { replace: true });
  }, [params, setParams]);
  return null;
}

/** Standard page chrome. The home page renders its own overlay navbar. */
export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isFullBleed = pathname.startsWith('/explore');
  return (
    <div className="flex min-h-dvh flex-col">
      <AndroidBanner />
      {!isHome && <Navbar />}
      <DonationToast />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isFullBleed && <Footer />}
      <ScrollRestoration />
    </div>
  );
}
