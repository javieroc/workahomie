import { FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { useAuth0 } from '@auth0/auth0-react';
import { RequestList } from '../components/RequestList';
import { useIncomingRequests, useOutgoingRequests } from '../hooks';

interface RequestProps {
  isIncoming?: boolean;
}

const Request: FC<RequestProps> = ({ isIncoming = false }) => {
  const { isAuthenticated } = useAuth0();
  const { data: hostMe, isLoading } = useHostMe({ enabled: isAuthenticated });
  const useRequest = isIncoming ? useIncomingRequests : useOutgoingRequests;
  const { data: requests } = useRequest(
    {
      pageIndex: 0,
      pageSize: 50,
    },
    { enabled: isIncoming ? !!hostMe : isAuthenticated },
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isIncoming && !hostMe) {
    return <Navigate to="/try-hosting" />;
  }

  return (
    <VStack spacing={8} align="flex-start" padding={4}>
      <VStack align="flex-start">
        <Heading size="md">{`${isIncoming ? 'Incoming' : 'Outgoing'} Requests`}</Heading>
      </VStack>
      <Flex gap={4} flexWrap="wrap" width="100%">
        {requests && <RequestList requests={requests.data} isIncoming={isIncoming} />}
        <Outlet />
      </Flex>
    </VStack>
  );
};

export { Request };
