import { Flex, Heading, Image, Text, Icon } from '@chakra-ui/react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Request } from 'src/types';
import { FaWhatsapp } from 'react-icons/fa';

interface RequestCardProps {
  request: Request;
  isIncoming?: boolean;
}

const RequestCard: FC<RequestCardProps> = ({ request, isIncoming = false }) => {
  const { requestId } = useParams<{ requestId: string }>();

  const name = isIncoming
    ? request.userEmail
    : `${request.host?.firstName} ${request.host?.lastName}`;
  const avatar = isIncoming ? request.userAvatar : request.host?.profileImages?.[0];
  const phone = isIncoming ? undefined : request.host?.phone;
  const description = isIncoming
    ? request.messages?.[request.messages.length - 1]?.message || 'New request'
    : request.host?.aboutMe || 'View request details';

  return (
    <Link to={`/host/${isIncoming ? 'incoming-requests' : 'outgoing-requests'}/${request._id}`}>
      <Flex
        gap={4}
        _hover={{ backgroundColor: 'purple.100', cursor: 'pointer', borderRadius: 8 }}
        padding={4}
        backgroundColor={request._id === requestId ? 'purple.100' : 'inherit'}
        alignItems="center"
      >
        <Image
          borderRadius="full"
          boxSize="50px"
          objectFit="cover"
          src={avatar ?? `https://ui-avatars.com/api/?name=${name}`}
          alt="Avatar"
        />
        <Flex flexDirection="column" justifyContent="center" flex={1} overflow="hidden">
          <Heading size="xs" noOfLines={1}>
            {name}
          </Heading>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {description}
          </Text>
          {phone && (
            <Flex align="center" gap={1} mt={1}>
              <Icon as={FaWhatsapp} color="green.500" />
              <Text fontSize="xs" color="gray.500">
                {phone}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Link>
  );
};

export { RequestCard };
