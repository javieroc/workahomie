import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, GridItem, Stack } from '@chakra-ui/react';
import { useHost } from '../../hooks';
import { HostTitle } from './components/HostTitle';
import { GridImageGallery } from './components/GridImageGallery';
import { HostUser } from './components/HostUser';
import { RequestForm } from './components/RequestForm';

const Details: FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const { data: host } = useHost(hostId!);

  return (
    <Stack padding="46px 120px" spacing={8}>
      {host && <HostTitle host={host} />}

      <GridImageGallery images={host?.pictures} />

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={2}>{host && <HostUser host={host} />}</GridItem>
        <GridItem>
          <RequestForm hostId={hostId!} />
        </GridItem>
      </Grid>
    </Stack>
  );
};

export { Details };
