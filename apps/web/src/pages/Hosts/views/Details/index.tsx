import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Grid, GridItem, Stack } from '@chakra-ui/react';
import { useHost } from '../../hooks';
import { RequestForm } from './components/RequestForm';
import { HostTitle } from './components/HostTitle';
import { HostUser } from './components/HostUser';
import { Reviews } from './components/Reviews';
import { Gallery } from './components/Gallery';

const Details: FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const { data: host, isLoading } = useHost(hostId!);

  return (
    <Stack
      pt={['20px', '20px', '46px']}
      pb={['20px', '20px', '46px']}
      pl={['16px', '46px', '120px']}
      pr={['16px', '46px', '120px']}
      spacing={8}
    >
      <HostTitle host={host} isLoading={isLoading} />
      <Gallery images={host?.pictures} isLoading={isLoading} />
      <Grid
        templateColumns={[
          'repeat(auto-fit, 1fr)',
          'repeat(auto-fit, 1fr)',
          'repeat(auto-fit, 1fr)',
          'repeat(3, 1fr)',
        ]}
        gap={4}
      >
        <GridItem colSpan={[1, 1, 1, 2]}>
          <HostUser host={host} isLoading={isLoading} />
        </GridItem>
        <GridItem>
          <RequestForm hostId={hostId!} />
        </GridItem>
      </Grid>
      <Divider />
      {hostId && <Reviews hostId={hostId} />}
    </Stack>
  );
};

export { Details };
