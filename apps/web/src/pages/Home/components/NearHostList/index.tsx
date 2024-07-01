import { FC } from 'react';
import { Heading, Skeleton, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { useHosts } from 'src/hooks';
import { NearHostCard } from '../NearHostCard';

const NearHostList: FC = () => {
  const { data: hosts, isLoading } = useHosts({
    pageIndex: 0,
    pageSize: 20,
  });

  return (
    <VStack padding={{ base: '16px', lg: '64px' }}>
      <VStack alignItems="flex-start" w={{ base: '1500px' }} mb="16px">
        <Heading size="lg">Near Hosts</Heading>
      </VStack>
      <Wrap spacing="20px" justify="flex-start" maxW={{ base: '1500px' }}>
        {hosts?.data.map((host) => (
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
