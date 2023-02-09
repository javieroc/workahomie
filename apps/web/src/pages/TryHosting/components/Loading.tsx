import { Skeleton, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { Layout } from 'src/components';

type LoadingProps = {
  isLoading: boolean;
};

const Loading: FC<LoadingProps> = ({ isLoading }) => {
  return (
    <Layout>
      <VStack spacing={4} align="flex-start" padding={4}>
        <Skeleton height="40px" width="600px" />
        <Skeleton height="40px" width="600px" />
        <Skeleton height="200px" width="400px" />
      </VStack>
    </Layout>
  );
};

export { Loading };
