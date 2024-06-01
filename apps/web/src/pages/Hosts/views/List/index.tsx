import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { useHosts } from 'src/hooks';
import { Actions, HostList, HostMap } from './components';
import { useFilters, usePagination } from '../../hooks';

const List: FC = () => {
  const { paginationParams } = usePagination();
  const { filters } = useFilters();
  const { data: hosts, isLoading } = useHosts({ ...paginationParams, ...filters });

  return (
    <Box>
      <Actions />
      <Flex>
        <HostList hosts={hosts} isLoading={isLoading} />
        <HostMap hosts={hosts} />
      </Flex>
    </Box>
  );
};

export { List };
