import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Grid, GridItem, Stack, useMediaQuery } from '@chakra-ui/react';
import { ImageCarousel } from 'src/components';
import { useHost } from '../../hooks';
import { HostTitle } from './components/HostTitle';
import { GridImageGallery } from './components/GridImageGallery';
import { HostUser } from './components/HostUser';
import { RequestForm } from './components/RequestForm';
import { Reviews } from './components/Reviews';

const Details: FC = () => {
  const { hostId } = useParams<{ hostId: string }>();
  const { data: host, isLoading } = useHost(hostId!);

  const [isLargerThanMD] = useMediaQuery('(min-width: 62em)');

  const displayGallery = isLargerThanMD && (host?.pictures?.length ?? 0) >= 5;
  return (
    <Stack
      pt={['20px', '20px', '46px']}
      pb={['20px', '20px', '46px']}
      pl={['16px', '46px', '120px']}
      pr={['16px', '46px', '120px']}
      spacing={8}
    >
      <HostTitle host={host} isLoading={isLoading} />
      {displayGallery && <GridImageGallery images={host?.pictures} isLoading={isLoading} />}
      {!displayGallery && <ImageCarousel images={host?.pictures ?? []} />}
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
