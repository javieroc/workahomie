import { Navigate, useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useHostMe } from '@/features/hosts/api';
import { useSession } from '@/auth/useSession';
import { Button } from '@/components/ui/Button';
import { ProfileForm } from './ProfileForm';

export default function BecomeHostPage() {
  const { data: host, isLoading } = useHostMe();
  const { user, isAuthenticated, isLoading: authLoading, login } = useSession();
  const navigate = useNavigate();
  if (authLoading || (isAuthenticated && isLoading)) return <FullPageSpinner />;
  if (host) return <Navigate to="/me/place" replace />;

  return (
    <div className="mx-auto grid max-w-[1200px] gap-16 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="eyebrow text-magenta-600">Step 1 of 2</p>
        <h1 className="mt-3 text-5xl font-semibold leading-[1] tracking-[-0.02em]">
          Open your door to a colleague.
        </h1>
        <ul className="mt-8 space-y-3 text-ink-2">
          {[
            'Free, no fees, ever',
            'You approve every request',
            'Chat before anyone visits',
            'Exact address stays private until you accept',
          ].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="grid size-6 place-items-center rounded-full bg-moss text-white">
                <Check className="size-3.5" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
        {isAuthenticated ? (
          <>
            <h2 className="text-2xl font-semibold">About you</h2>
            <div className="mt-6">
              <ProfileForm
                defaults={{ firstName: user?.given_name, lastName: user?.family_name }}
                onSaved={() => navigate('/me/place')}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-2xl font-semibold">Start with a free account</h2>
            <p className="mt-2 text-ink-2">
              Sign in, tell guests a bit about you, then pin your workspace on the map. It takes
              about three minutes.
            </p>
            <Button
              variant="ink"
              size="lg"
              className="mt-6 self-start"
              onClick={() => void login('/become-a-host')}
            >
              Sign in to start hosting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
