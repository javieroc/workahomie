import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { RequestList } from '../components/RequestList';
import { useOutgoingRequests } from '../hooks';

const OutgoingRequests: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { data: outgoingRequests } = useOutgoingRequests({ pageIndex: 0, pageSize: 50 });

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return (
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="md">Outgoing Requests</Heading>
        </VStack>
        <Flex gap={4}>
          {outgoingRequests && <RequestList requests={outgoingRequests.data} />}
          <Outlet />
        </Flex>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { OutgoingRequests };
