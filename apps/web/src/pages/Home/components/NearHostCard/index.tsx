import { Box, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { StarIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { Host } from 'src/types';
import { LikeButton } from 'src/components/LikeButton';

interface NearHostCardProps {
  host: Host;
  initialLiked?: boolean;
}

const NearHostCard: FC<NearHostCardProps> = ({ host, initialLiked }) => {
  const { isAuthenticated } = useAuth0();
  return (
    <Link to={`/hosts/${host._id}`}>
      <HStack
        spacing="12px"
        width="360px"
        height="160px"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Box position="relative">
          <Image
            src={host.profileImages[0]}
            borderRadius="md"
            boxSize="140px"
            minWidth="140px"
            height="160px"
            objectFit="cover"
          />
          {isAuthenticated && <LikeButton hostId={host._id} initialLiked={initialLiked} />}
        </Box>
        <Flex
          direction="column"
          justifyContent="space-between"
          width="100%"
          height="160px"
          padding="8px"
        >
          <VStack align="stretch" spacing="2px">
            <Heading size="sm">{`${host.firstName} ${host.lastName}`}</Heading>
            <Text fontSize="md">{host.occupation}</Text>
          </VStack>
          <HStack align="center">
            {host.countReviews > 0 ? (
              <>
                <StarIcon w={4} h={4} color="pink.500" />
                <Text fontSize="sm">
                  {host.rate?.toFixed(1)}
                  <Text marginLeft="4px" as="span" color="gray.500">
                    {`(${host.countReviews} Reviews)`}
                  </Text>
                </Text>
              </>
            ) : (
              <Text fontSize="sm" color="gray.500">
                No reviews yet
              </Text>
            )}
          </HStack>
        </Flex>
      </HStack>
    </Link>
  );
};

export { NearHostCard };
