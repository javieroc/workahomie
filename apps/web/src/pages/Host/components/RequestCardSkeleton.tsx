import { Flex, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { FC } from 'react';

const RequestCardSkeleton: FC = () => {
  return (
    <Flex gap={4} padding={4} alignItems="center">
      <SkeletonCircle size="50px" />
      <Flex flexDirection="column" justifyContent="center" flex={1} overflow="hidden">
        <Skeleton height="20px" width="300px" />
        <SkeletonText mt="2" noOfLines={1} spacing="4" skeletonHeight="2" />
      </Flex>
    </Flex>
  );
};

export { RequestCardSkeleton };
