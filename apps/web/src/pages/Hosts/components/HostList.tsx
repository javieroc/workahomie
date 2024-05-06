import { FC } from 'react';
import { Heading, Skeleton, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import { useHosts } from 'src/hooks';
import { HostCard } from './HostCard';

const HostList: FC = () => {
  const { data: hosts, isLoading } = useHosts();

  return (
    <Stack padding="24px">
      <Heading size="md" marginBottom="16px">
        More than 1000 Hosts
      </Heading>
      <Wrap spacing="32px" justify="flex-start">
        {hosts?.map((host) => (
          <WrapItem key={host._id}>
            <Skeleton isLoaded={!isLoading}>
              <HostCard host={host} />
            </Skeleton>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
};

export { HostList };
