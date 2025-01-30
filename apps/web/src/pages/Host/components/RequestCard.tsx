import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Request } from 'src/types';

interface RequestCardProps {
  request: Request;
  isIncoming?: boolean;
}

const RequestCard: FC<RequestCardProps> = ({ request, isIncoming = false }) => {
  const userAvatar =
    (isIncoming ? request.userAvatar : request.host?.profileImages[0]) ??
    'https://ui-avatars.com/api/?name=John+Doe';
  return (
    <Link to={`/host/incoming-requests/${request._id}`}>
      <Flex
        gap={4}
        _hover={{ backgroundColor: 'purple.100', cursor: 'pointer', borderRadius: 8 }}
        padding={4}
      >
        <Image
          borderRadius="full"
          boxSize="50px"
          objectFit="cover"
          src={userAvatar}
          alt="Outgoing Request"
        />
        <Flex flexDirection="column" justifyContent="center">
          <Heading size="xs">{`${request.host?.firstName} ${request.host?.lastName}`}</Heading>
          <Text fontSize="xs" color="gray.500">
            Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export { RequestCard };
