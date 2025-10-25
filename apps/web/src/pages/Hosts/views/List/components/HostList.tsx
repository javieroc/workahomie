import { FC } from 'react';
import { Heading, Skeleton, Stack, Wrap, WrapItem, VStack, Icon, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { Host, ListResponse } from 'src/types';
import { HostCard } from './HostCard';
import { PaginationControl } from './PaginationControl';

type HostListProps = {
  hosts: ListResponse<Host> | undefined;
  isLoading: boolean;
};

const HostList: FC<HostListProps> = ({ hosts, isLoading }) => {
  return (
    <Stack padding="24px" minW="300px" flex={1}>
      <Heading size="md" marginBottom="16px">
        List of Hosts
      </Heading>
      {hosts?.data.length === 0 ? (
        <VStack spacing={4} justify="center" flex={1}>
          <Icon as={FiSearch} boxSize={12} color="gray.400" />
          <Heading size="md">No hosts found</Heading>
          <Text color="gray.500">Try adjusting your filters</Text>
        </VStack>
      ) : (
        <Wrap spacing="32px" justify="flex-start">
          {hosts?.data.map((host) => (
            <WrapItem key={host._id}>
              <Skeleton isLoaded={!isLoading}>
                <HostCard host={host} />
              </Skeleton>
            </WrapItem>
          ))}
        </Wrap>
      )}
      {hosts?.total && <PaginationControl total={hosts?.total} />}
    </Stack>
  );
};

export { HostList };
