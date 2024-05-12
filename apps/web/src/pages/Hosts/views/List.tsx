import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Actions, HostList, HostMap } from '../components';

const List: FC = () => {
  return (
    <Box>
      <Actions />
      <Flex>
        <HostList />
        <HostMap />
      </Flex>
    </Box>
  );
};

export { List };
