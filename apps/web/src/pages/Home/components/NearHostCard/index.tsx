import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Host } from 'src/types';

interface NearHostCardProps {
  host: Host;
}

const NearHostCard: FC<NearHostCardProps> = ({ host }) => {
  return (
    <Link to={`/hosts/${host._id}`}>
      <HStack
        spacing="12px"
        width="360px"
        height="160px"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Image
          src={host.profileImages[0]}
          borderRadius="md"
          boxSize="140px"
          minWidth="140px"
          height="160px"
          objectFit="cover"
        />
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
            <StarIcon w={4} h={4} color="pink.500" />
            <Text fontSize="sm">
              {host.rate ?? 4.3}
              <Text marginLeft="4px" as="span" color="gray.500">
                {`(${host.countReviews ?? 10} Reviews)`}
              </Text>
            </Text>
          </HStack>
        </Flex>
      </HStack>
    </Link>
  );
};

export { NearHostCard };
