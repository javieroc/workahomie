import { useNavigate } from 'react-router';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useHostMe } from '@/features/hosts/api';
import { useSession } from '@/auth/useSession';
import { ProfileForm } from './ProfileForm';

export default function ProfilePage() {
  const { data: host, isLoading } = useHostMe();
  const { user } = useSession();
  const navigate = useNavigate();
  if (isLoading) return <FullPageSpinner />;
  return (
    <div>
      <h2 className="text-2xl font-semibold">{host ? 'Your host profile' : 'Become a host'}</h2>
      <p className="mt-1 text-muted">
        {host
          ? 'This is what guests see next to your workspace.'
          : 'Two quick steps: about you, then your workspace.'}
      </p>
      <div className="mt-8">
        <ProfileForm
          host={host}
          defaults={{ firstName: user?.given_name, lastName: user?.family_name }}
          onSaved={() => !host && navigate('/me/place')}
        />
      </div>
    </div>
  );
}
