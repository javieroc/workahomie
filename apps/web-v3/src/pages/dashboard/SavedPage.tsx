import { Heart } from 'lucide-react';
import { HostCard, HostCardSkeleton } from '@/components/HostCard';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/misc';
import { useWishlist } from '@/features/wishlist/api';

export default function SavedPage() {
  const { data, isLoading } = useWishlist();
  if (!isLoading && !data?.data.length)
    return (
      <EmptyState icon={<Heart className="size-5" />} title="Nothing saved yet">
        Tap the heart on any workspace to keep it here.
        <ButtonLink to="/explore" size="sm" variant="ink" className="mt-4">
          Explore the map
        </ButtonLink>
      </EmptyState>
    );
  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }, (_, i) => <HostCardSkeleton key={i} />)
        : data?.data.map((h) => <HostCard key={h._id} host={h} />)}
    </div>
  );
}
