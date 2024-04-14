import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Layout } from 'src/components';
import { Actions, HostList, HostMap } from './components';

const Hosts: FC = () => {
  return (
    <Layout>
      <Box padding="32px">
        <Actions />
        <Flex overflow="hidden">
          <HostList />
          <HostMap />
        </Flex>
      </Box>
    </Layout>
  );
};

export { Hosts };
