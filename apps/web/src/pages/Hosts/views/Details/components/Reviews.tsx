import { Flex, Heading, SkeletonText, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { usePagination, useReviews } from 'src/pages/Hosts/hooks';
import { Review } from './Review';

interface ReviewsProps {
  hostId: string;
}

const Reviews: FC<ReviewsProps> = ({ hostId }) => {
  const { paginationParams } = usePagination();
  const { data: response, isLoading } = useReviews(hostId, paginationParams);

  return (
    <VStack align="flex-start">
      <Heading size="lg">Reviews</Heading>
      {isLoading ? (
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      ) : (
        <Flex wrap="wrap" gap={8}>
          {response?.data?.map((review) => <Review key={review._id} {...review} />)}
        </Flex>
      )}
    </VStack>
  );
};

export { Reviews };
