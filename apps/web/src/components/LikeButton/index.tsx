import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { IconButton } from '@chakra-ui/react';
import { useLikeHost } from 'src/hooks';
import { FC, useState } from 'react';

interface LikeButtonProps {
  hostId: string;
  initialLiked?: boolean;
}

const LikeButton: FC<LikeButtonProps> = ({ hostId, initialLiked = false }) => {
  const [liked, setLiked] = useState(initialLiked);
  const { toggle, isLoading } = useLikeHost();

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await toggle(hostId, liked);
    } catch (err) {
      setLiked(liked);
    }
  };

  return (
    <IconButton
      icon={liked ? <FaHeart fontSize="24px" /> : <FaRegHeart fontSize="24px" />}
      aria-label="Add to wishlist"
      size="sm"
      color="pink.500"
      variant="ghost"
      position="absolute"
      top="6px"
      left="6px"
      zIndex={1}
      onClick={handleWishlistClick}
    />
  );
};

export { LikeButton };
