import { FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Host } from 'src/types';
import { RequestList } from '../components/RequestList';
import { useIncomingRequests, useOutgoingRequests } from '../hooks';

interface RequestProps {
  isIncoming?: boolean;
  host: Host | undefined;
}

const Request: FC<RequestProps> = ({ isIncoming = false, host }) => {
  const { isAuthenticated } = useAuth0();
  const useRequest = isIncoming ? useIncomingRequests : useOutgoingRequests;
  const { data: requests, isLoading } = useRequest(
    {
      pageIndex: 0,
      pageSize: 50,
    },
    { enabled: isIncoming ? !!host : isAuthenticated },
  );

  if (isIncoming && !host) {
    return <Navigate to="/try-hosting" />;
  }

  return (
    <VStack spacing={8} align="flex-start" padding={4}>
      <VStack align="flex-start">
        <Heading size="md">{`${isIncoming ? 'Incoming' : 'Outgoing'} Requests`}</Heading>
      </VStack>
      <Flex gap={4} flexWrap="wrap" width="100%">
        <RequestList
          requests={requests?.data || []}
          isIncoming={isIncoming}
          isLoading={isLoading}
        />
        <Outlet />
      </Flex>
    </VStack>
  );
};

export { Request };
