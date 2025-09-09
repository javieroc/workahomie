import { Grid, GridItem, Image, Skeleton } from '@chakra-ui/react';
import { FC } from 'react';

type GridImageGalleryProps = {
  images?: string[];
  isLoading: boolean;
};

const GridImageGallery: FC<GridImageGalleryProps> = ({ images, isLoading }) => {
  if (isLoading) {
    return <Skeleton height="500px" width="100%" />;
  }

  return (
    <Grid h="500px" templateRows="repeat(2, 1fr)" templateColumns="repeat(4, 1fr)" gap={4}>
      {images?.slice(0, 5).map((pic, index) => (
        <GridItem key={pic} rowSpan={index === 0 ? 2 : 1} colSpan={index === 0 ? 2 : 1}>
          <Image
            src={pic}
            width="100%"
            height={index === 0 ? '500px' : '242px'}
            borderRadius="lg"
            objectFit="cover"
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export { GridImageGallery };
