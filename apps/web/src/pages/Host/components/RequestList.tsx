import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Request } from 'src/types';
import { RequestCard } from './RequestCard';

interface RequestListProps {
  requests: Request[];
  isIncoming?: boolean;
}

const RequestList: FC<RequestListProps> = ({ requests, isIncoming = false }) => {
  return (
    <Flex flexDirection="column" gap={2}>
      {requests.map((request) => (
        <RequestCard key={request._id} request={request} isIncoming={isIncoming} />
      ))}
    </Flex>
  );
};

export { RequestList };
