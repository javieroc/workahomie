import { FC, PropsWithChildren } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Layout } from 'src/components';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { FiPhoneIncoming, FiPhoneOutgoing } from 'react-icons/fi';
import { Host } from 'src/types';
import { Sidebar } from './Sidebar';

interface HostLayoutProps extends PropsWithChildren {
  host: Host | undefined;
}

const HostLayout: FC<HostLayoutProps> = ({ children, host }) => {
  const hostLinks = [
    { title: 'Profile', to: '/host/profile', icon: FaRegUserCircle },
    { title: 'My Place', to: '/host/place', icon: FaHome },
    { title: 'Incoming Requests', to: '/host/incoming-requests', icon: FiPhoneIncoming },
  ];

  const userLinks = [
    { title: 'Outgoing Requests', to: '/host/outgoing-requests', icon: FiPhoneOutgoing },
  ];

  return (
    <Layout>
      <Flex>
        <Sidebar links={[...(host ? hostLinks : []), ...userLinks]} />
        <Box flex={1}>{children}</Box>
      </Flex>
    </Layout>
  );
};

export { HostLayout };
