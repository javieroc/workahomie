import { FC, PropsWithChildren } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { Layout } from 'src/components';
import { Sidebar } from './Sidebar';

const HostLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Layout>
      <Grid templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={1}>
          <Sidebar
            links={[
              { title: 'Profile', to: '/host/profile' },
              { title: 'My Place', to: '/host/place' },
            ]}
          />
        </GridItem>
        <GridItem colSpan={4}>{children}</GridItem>
      </Grid>
    </Layout>
  );
};

export { HostLayout };
