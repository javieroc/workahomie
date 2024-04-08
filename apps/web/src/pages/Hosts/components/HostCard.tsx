import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Host } from 'src/types';

interface HostCardProps {
  host: Host;
}

const HostCard: FC<HostCardProps> = ({ host }) => {
  return (
    <Link to="/#">
      <HStack
        spacing="12px"
        width="660px"
        height="220px"
        padding="16px"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Image
          src={host?.place?.pictures[0]}
          borderRadius="md"
          boxSize="140px"
          minWidth="306px"
          height="188px"
          objectFit="cover"
        />
        <Flex
          direction="column"
          justifyContent="space-between"
          width="100%"
          height="100%"
          padding="8px"
        >
          <VStack align="stretch" spacing="2px">
            <HStack>
              <Heading size="xs">
                {`${host.firstName} ${host.lastName}`}
                <Heading size="xs" color="orange.500">{`${host.occupation}`}</Heading>
              </Heading>
            </HStack>
            <Text fontSize="sm">{host.place.addressLabel}</Text>
            <Text fontSize="sm">{host.place.details}</Text>
            <Divider width="10%" borderColor="darkgray" />
            <Text fontSize="xs">{host.place.facilities?.join(' - ')}</Text>
          </VStack>
          <HStack align="center" alignSelf="end">
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

export { HostCard };
