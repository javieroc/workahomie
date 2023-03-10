import { FC } from 'react';
import { Button, Flex, Heading, Skeleton, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { NearHostCard } from '../NearHostCard';
import { useHosts } from '../../hooks';

const NearHostList: FC = () => {
  const { data: hosts, isLoading } = useHosts();

  return (
    <VStack align="center" padding={{ base: '16px', lg: '64px' }}>
      <Flex justifyContent="space-between" alignItems="center" width="100%" marginBottom="16px">
        <Heading size="lg">Near Hosts</Heading>
        <Button variant="link" color="orange.500">
          See All
        </Button>
      </Flex>
      <Wrap spacing="20px" justify="flex-start">
        {hosts?.map((host) => (
          <WrapItem key={host._id}>
            <Skeleton isLoaded={!isLoading}>
              <NearHostCard host={host} />
            </Skeleton>
          </WrapItem>
        ))}
      </Wrap>
    </VStack>
  );
};

export { NearHostList };
