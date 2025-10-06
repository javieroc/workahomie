import { FC, PropsWithChildren } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Layout } from 'src/components';
import { FaHome, FaRegUserCircle } from 'react-icons/fa';
import { FiPhoneIncoming, FiPhoneOutgoing } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';
import { useHostMe } from 'src/hooks/useHostMe';
import { Sidebar } from './Sidebar';

const HostLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  const { data: hostMe } = useHostMe({ enabled: isAuthenticated });

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
        <Sidebar links={[...(hostMe ? hostLinks : []), ...userLinks]} />
        <Box flex={1}>{children}</Box>
      </Flex>
    </Layout>
  );
};

export { HostLayout };
