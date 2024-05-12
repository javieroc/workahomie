import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Divider,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Host } from 'src/types';

interface HostCardProps {
  host: Host;
}

const HostCard: FC<HostCardProps> = ({ host }) => {
  return (
    <Link to={`/hosts/${host._id}`}>
      <Card width={['240px', '360px']} variant="outline">
        <CardBody>
          <Image
            src={host?.place?.pictures[0]}
            boxSize="320px"
            borderRadius="md"
            objectFit="cover"
          />
          <Stack mt="6" spacing="3">
            <Heading size="xs">
              {`${host.firstName} ${host.lastName}`}
              <Heading size="xs" color="orange.500" as="div">{`${host.occupation}`}</Heading>
            </Heading>
            <VStack align="stretch" spacing="2px">
              <Text fontSize="sm" noOfLines={1}>
                {host.place.addressObj?.label}
              </Text>
              <Text fontSize="sm" noOfLines={2}>
                {host.place.details}
              </Text>
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
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
};

export { HostCard };
