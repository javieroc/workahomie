import { FC, PropsWithChildren } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Layout } from 'src/components';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { FiPhoneIncoming, FiPhoneOutgoing } from 'react-icons/fi';
import { Sidebar } from './Sidebar';

const HostLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout>
      <Flex>
        <Sidebar
          links={[
            { title: 'Profile', to: '/host/profile', icon: FaRegUserCircle },
            { title: 'My Place', to: '/host/place', icon: FaHome },
            { title: 'Incoming Requests', to: '/host/incoming-requests', icon: FiPhoneIncoming },
            { title: 'Outgoing Requests', to: '/host/outgoing-requests', icon: FiPhoneOutgoing },
          ]}
        />
        <Box flex={1}>{children}</Box>
      </Flex>
    </Layout>
  );
};

export { HostLayout };
