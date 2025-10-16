import { FC } from 'react';
import {
  Box,
  Image,
  SimpleGrid,
  Skeleton,
  useBreakpointValue,
  AspectRatio,
} from '@chakra-ui/react';

type GalleryProps = {
  images?: string[];
  isLoading: boolean;
};

const Gallery: FC<GalleryProps> = ({ images, isLoading }) => {
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

  if (isLoading) {
    return <Skeleton height="300px" width="100%" borderRadius="md" />;
  }

  const imgs = images ?? [];

  if (imgs.length === 0) {
    return (
      <Box
        height="300px"
        width="100%"
        bg="gray.100"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.500"
      >
        No images available
      </Box>
    );
  }

  if (imgs.length === 1) {
    return (
      <Box width="100%">
        <Image
          src={imgs[0]}
          alt="Gallery image"
          objectFit="contain"
          borderRadius="md"
          width="100%"
          maxH="500px"
        />
      </Box>
    );
  }

  return (
    <SimpleGrid columns={columns} spacing={2} width="100%">
      {imgs.map((src, idx) => (
        <Box key={idx} position="relative" overflow="hidden" borderRadius="md">
          <AspectRatio ratio={4 / 3} maxH="300px">
            <Image src={src} alt={`Gallery ${idx}`} objectFit="cover" width="100%" height="100%" />
          </AspectRatio>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export { Gallery };
