import { StarIcon } from '@chakra-ui/icons';
import { HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Host } from 'src/types';

type HostTitleProps = {
  host: Host;
};

const HostTitle: FC<HostTitleProps> = ({ host }) => {
  return (
    <Stack>
      <Heading size="xl">{host?.place.description}</Heading>
      <HStack align="center">
        <StarIcon w={4} h={4} color="pink.500" />
        <Text fontSize="xl" color="gray.600">
          {`${host?.rate ?? 4.3} (${host?.countReviews ?? 10} Reviews) - ${host?.place.addressObj?.label ?? host?.place.address}`}
        </Text>
      </HStack>
    </Stack>
  );
};

export { HostTitle };
