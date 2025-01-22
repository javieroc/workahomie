import { FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useHostMe } from 'src/hooks/useHostMe';
import { Loading } from 'src/components';
import { GuestList } from '../components/GuestList';
import { ChatBox } from '../components/ChatBox';

const IncomingRequests: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();

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
          <GuestList />
          <ChatBox />
        </Flex>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { IncomingRequests };
