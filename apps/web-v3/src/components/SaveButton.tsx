import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/auth/useSession';
import { useToggleWishlist, useWishlistIds } from '@/features/wishlist/api';
import { cn } from '@/lib/cn';

export function SaveButton({ hostId, className }: { hostId: string; className?: string }) {
  const { isAuthenticated, login } = useSession();
  const { data: ids = [] } = useWishlistIds();
  const toggle = useToggleWishlist();
  const saved = ids.includes(hostId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save this place'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          toast('Sign in to save places', {
            action: { label: 'Sign in', onClick: () => void login() },
          });
          return;
        }
        toggle.mutate(
          { hostId, saved },
          { onError: () => toast.error('Could not update saved places') },
        );
      }}
      className={cn(
        'grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110 active:scale-95',
        className,
      )}
    >
      <Heart
        className={cn('size-[18px] transition', saved ? 'fill-magenta text-magenta' : 'text-ink')}
      />
    </button>
  );
}
