import {
  Flex,
  Heading,
  Image,
  Text,
  Icon,
  Button,
  ButtonGroup,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Request } from 'src/types';
import { FaWhatsapp } from 'react-icons/fa';
import { isPast } from 'date-fns';
import { useUpdateRequestStatus } from '../hooks/useUpdateRequestStatus';

interface RequestCardProps {
  request: Request;
  isIncoming?: boolean;
}

const RequestCard: FC<RequestCardProps> = ({ request, isIncoming = false }) => {
  const { requestId } = useParams<{ requestId: string }>();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateRequestStatus(request._id);
  const isPastRequest = isPast(new Date(request.checkOut));

  const name = isIncoming
    ? request.userEmail
    : `${request.host?.firstName} ${request.host?.lastName}`;
  const avatar = isIncoming ? request.userAvatar : request.host?.profileImages?.[0];
  const phone = isIncoming ? undefined : request.host?.phone;
  const lastMessage = isIncoming
    ? request.messages?.[request.messages.length - 1]?.message || 'New request'
    : request.host?.aboutMe || 'View request details';

  const handleAccept = () => {
    updateStatus({ status: 'accepted' });
  };

  const handleDecline = () => {
    updateStatus({ status: 'declined' });
  };

  return (
    <Flex
      direction="column"
      gap={2}
      _hover={{ backgroundColor: 'purple.100', cursor: 'pointer', borderRadius: 8 }}
      padding={4}
      backgroundColor={request._id === requestId ? 'purple.100' : 'inherit'}
    >
      <Link to={`/host/${isIncoming ? 'incoming-requests' : 'outgoing-requests'}/${request._id}`}>
        <Flex gap={4} alignItems="center">
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
            <Text fontSize="xs" color="gray.500">
              {new Date(request.checkIn).toLocaleDateString()} -{' '}
              {new Date(request.checkOut).toLocaleDateString()}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {lastMessage}
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
      <Flex justify="space-between" align="center">
        <HStack>
          {!isPastRequest && (
            <Badge
              colorScheme={
                request.status === 'pending'
                  ? 'yellow'
                  : request.status === 'accepted'
                    ? 'green'
                    : 'red'
              }
            >
              {request.status}
            </Badge>
          )}
          {isPastRequest && <Badge colorScheme="gray">Past</Badge>}
        </HStack>
        {isIncoming && request.status === 'pending' && !isPastRequest && (
          <ButtonGroup size="xs">
            <Button colorScheme="green" onClick={handleAccept} isLoading={isUpdatingStatus}>
              Accept
            </Button>
            <Button colorScheme="red" onClick={handleDecline} isLoading={isUpdatingStatus}>
              Decline
            </Button>
          </ButtonGroup>
        )}
      </Flex>
    </Flex>
  );
};

export { RequestCard };
