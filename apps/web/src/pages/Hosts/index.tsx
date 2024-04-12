import { Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { Layout } from 'src/components';
import { HostList, HostMap } from './components';

const Hosts: FC = () => {
  return (
    <Layout>
      <Heading>Hosts</Heading>
      <HostList />
      <HostMap />
    </Layout>
  );
};

export { Hosts };
