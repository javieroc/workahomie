import { FC } from 'react';
import { Skeleton, Wrap, WrapItem } from '@chakra-ui/react';
import { useHosts } from 'src/hooks';
import { HostCard } from './HostCard';

const HostList: FC = () => {
  const { data: hosts, isLoading } = useHosts();

  return (
    <Wrap spacing="20px" justify="flex-start">
      {hosts?.map((host) => (
        <WrapItem key={host._id}>
          <Skeleton isLoaded={!isLoading}>
            <HostCard host={host} />
          </Skeleton>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export { HostList };
