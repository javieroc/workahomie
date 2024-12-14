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
    <VStack paddingY={{ base: '16px', lg: '64px' }} paddingX={{ base: '16px', lg: '140px' }}>
      <VStack alignItems="flex-start" mb="16px" w="100%">
        <Heading size="lg">Near Hosts</Heading>
      </VStack>
      <Wrap spacing="20px" justify="flex-start">
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
