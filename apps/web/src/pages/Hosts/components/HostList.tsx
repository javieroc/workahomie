import { FC } from 'react';
import { Heading, Skeleton, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import { useHosts } from 'src/hooks';
import { PaginationControl } from 'src/components';
import { HostCard } from './HostCard';
import { usePagination } from '../hooks';

const HostList: FC = () => {
  const { paginationParams } = usePagination();
  const { data: hosts, isLoading } = useHosts(paginationParams);

  return (
    <Stack padding="24px">
      <Heading size="md" marginBottom="16px">
        More than 1000 Hosts
      </Heading>
      <Wrap spacing="32px" justify="flex-start">
        {hosts?.data.map((host) => (
          <WrapItem key={host._id}>
            <Skeleton isLoaded={!isLoading}>
              <HostCard host={host} />
            </Skeleton>
          </WrapItem>
        ))}
      </Wrap>
      {hosts?.total && <PaginationControl total={hosts?.total} />}
    </Stack>
  );
};

export { HostList };
