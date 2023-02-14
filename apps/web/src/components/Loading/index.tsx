import { Skeleton, VStack } from '@chakra-ui/react';
import { FC } from 'react';

const Loading: FC = () => {
  return (
    <VStack spacing={4} align="flex-start" padding={4}>
      <Skeleton height="40px" width="600px" />
      <Skeleton height="40px" width="600px" />
      <Skeleton height="200px" width="400px" />
    </VStack>
  );
};

export { Loading };
