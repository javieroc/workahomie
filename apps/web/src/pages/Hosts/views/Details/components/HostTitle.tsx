import { StarIcon } from '@chakra-ui/icons';
import { HStack, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Host } from 'src/types';

type HostTitleProps = {
  host?: Host;
  isLoading: boolean;
};

const HostTitle: FC<HostTitleProps> = ({ host, isLoading }) => {
  if (isLoading) {
    return (
      <Stack>
        <Skeleton height="40px" width="400px" />
        <Skeleton height="20px" width="600px" />
      </Stack>
    );
  }

  return (
    <Stack>
      <Heading size={['md', 'xl']} noOfLines={1}>
        {host?.placeDescription}
      </Heading>
      <HStack align="center">
        <StarIcon w={4} h={4} color="pink.500" />
        <Text fontSize={['md', 'xl']} color="gray.600">
          {`${host?.rate ?? 4.3} (${host?.countReviews ?? 10} Reviews) - ${
            host?.addressObj?.display_name ?? host?.address
          }`}
        </Text>
      </HStack>
    </Stack>
  );
};

export { HostTitle };
