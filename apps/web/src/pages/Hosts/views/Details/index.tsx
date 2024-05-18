import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@chakra-ui/react';
import { useHost } from '../../hooks';
import { HostTitle } from './components/HostTitle';
import { GridImageGallery } from './components/GridImageGallery';
import { HostUser } from './components/HostUser';

const Details: FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const { data: host } = useHost(hostId!);

  return (
    <Stack padding="46px 120px" spacing={8}>
      {host && <HostTitle host={host} />}

      <GridImageGallery images={host?.place.pictures} />

      {host && <HostUser host={host} />}
    </Stack>
  );
};

export { Details };
