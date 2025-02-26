import { FC, useState } from 'react';
import { Heading, Skeleton, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { useHosts } from 'src/hooks';
import { Pagination } from 'src/components/Pagination';
import { NearHostCard } from '../NearHostCard';

const NearHostList: FC = () => {
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(0);
  const { data: hosts, isLoading } = useHosts({ pageIndex, pageSize });
  const totalPages = hosts?.total ? Math.ceil(hosts.total / pageSize) : 0;

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
      <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
    </VStack>
  );
};

export { NearHostList };
