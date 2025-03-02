import { FC } from 'react';
import { Layout } from 'src/components';
import { Banner, Details } from './components';

const HowItWorks: FC = () => {
  return (
    <Layout>
      <Banner />
      <Details />
    </Layout>
  );
};

export { HowItWorks };
