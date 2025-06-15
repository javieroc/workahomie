import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from 'src/api';

export const useLikeHost = () => {
  const { mutateAsync: addToWishlist, isPending: isAdding } = useMutation({
    mutationFn: async (hostId: string) => {
      await api.post('/wishlists/add', { hostId });
    },
  });

  const { mutateAsync: removeFromWishlist, isPending: isRemoving } = useMutation({
    mutationFn: async (hostId: string) => {
      await api.delete('/wishlists/remove', { data: { hostId } });
    },
  });

  const isLoading = isAdding || isRemoving;

  const toggle = useCallback(
    async (hostId: string, isCurrentlyLiked: boolean) => {
      if (isLoading) return;

      if (isCurrentlyLiked) {
        await removeFromWishlist(hostId);
      } else {
        await addToWishlist(hostId);
      }
    },
    [isLoading, addToWishlist, removeFromWishlist],
  );

  return { toggle, isLoading };
};
