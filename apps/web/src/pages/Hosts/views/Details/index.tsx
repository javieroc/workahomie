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
  const { data: host } = useHost(hostId!);
  const [isLargerThanMD] = useMediaQuery('(min-width: 48em)');

  return (
    <Stack
      pt={['20px', '46px']}
      pb={['20px', '46px']}
      pl={['16px', '120px']}
      pr={['16px', '120px']}
      spacing={8}
    >
      {host && <HostTitle host={host} />}
      {isLargerThanMD && <GridImageGallery images={host?.pictures} />}
      {!isLargerThanMD && <ImageCarousel images={host?.pictures ?? []} />}
      <Grid
        templateColumns={['repeat(auto-fit, 1fr)', 'repeat(auto-fit, 1fr)', 'repeat(3, 1fr)']}
        gap={4}
      >
        <GridItem colSpan={[1, 1, 2]}>{host && <HostUser host={host} />}</GridItem>
        <GridItem>
          <RequestForm hostId={hostId!} />
        </GridItem>
      </Grid>
      <Divider />
      <Reviews />
    </Stack>
  );
};

export { Details };
