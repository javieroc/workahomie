import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { Loading } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';

const OutgoingRequests: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return (
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="md">Outgoing Requests</Heading>
          <Heading size="sm">Handle your requests</Heading>
        </VStack>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { OutgoingRequests };
