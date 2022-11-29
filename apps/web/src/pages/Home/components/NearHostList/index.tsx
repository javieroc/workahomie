import { FC } from 'react';
import { Button, Flex, Heading, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { Host } from 'src/types';
import { NearHostCard } from '../NearHostCard';

interface NearHostListProps {
  hosts: Host[];
}

const NearHostList: FC<NearHostListProps> = ({ hosts }) => {
  return (
    <VStack align="center" padding={{ base: '16px', lg: '64px' }}>
      <Flex justifyContent="space-between" alignItems="center" width="100%" marginBottom="16px">
        <Heading size="lg">Near Hosts</Heading>
        <Button variant="link" color="orange.500">
          See All
        </Button>
      </Flex>
      <Wrap spacing="20px" justify="center">
        {hosts.map((host) => (
          <WrapItem key={host.name}>
            <NearHostCard host={host} />
          </WrapItem>
        ))}
      </Wrap>
    </VStack>
  );
};

export { NearHostList };
