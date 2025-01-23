import { FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { useIncomingRequests } from 'src/pages/Hosts/hooks';
import { RequestList } from '../components/RequestList';
import { ChatBox } from '../components/ChatBox';

const IncomingRequests: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { data: incomingRequests } = useIncomingRequests({ pageIndex: 0, pageSize: 50 });

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return (
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="md">Incoming Requests</Heading>
        </VStack>
        <Flex gap={4}>
          {incomingRequests && <RequestList requests={incomingRequests.data} />}
          <ChatBox />
        </Flex>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { IncomingRequests };
