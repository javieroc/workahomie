import { Flex, VStack, Icon, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Request } from 'src/types';
import { FiInbox } from 'react-icons/fi';
import { RequestCard } from './RequestCard';
import { RequestCardSkeleton } from './RequestCardSkeleton';

interface RequestListProps {
  requests: Request[];
  isIncoming?: boolean;
  isLoading?: boolean;
}

const RequestList: FC<RequestListProps> = ({ requests, isIncoming = false, isLoading = false }) => {
  if (isLoading) {
    return (
      <Flex flexDirection="column" gap={2} maxW="400px">
        {Array.from({ length: 5 }).map((_, index) => (
          <RequestCardSkeleton key={index} />
        ))}
      </Flex>
    );
  }

  if (requests.length === 0) {
    return (
      <VStack spacing={4} p={8} bg="gray.50" borderRadius="md" maxW="400px" w="100%">
        <Icon as={FiInbox} boxSize={12} color="gray.400" />
        <Text color="gray.500">No requests found.</Text>
      </VStack>
    );
  }

  return (
    <Flex flexDirection="column" gap={2} maxW="400px">
      {requests.map((request) => (
        <RequestCard key={request._id} request={request} isIncoming={isIncoming} />
      ))}
    </Flex>
  );
};

export { RequestList };
