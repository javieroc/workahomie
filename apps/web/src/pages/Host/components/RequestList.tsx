import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Request } from 'src/types';
import { RequestCard } from './RequestCard';

interface RequestListProps {
  requests: Request[];
}

const RequestList: FC<RequestListProps> = ({ requests }) => {
  return (
    <Flex flexDirection="column" gap={2}>
      {requests.map((request) => (
        <RequestCard key={request._id} request={request} />
      ))}
    </Flex>
  );
};

export { RequestList };
