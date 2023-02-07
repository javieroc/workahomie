import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider, Layout } from 'src/components';
import { FormFields } from './components/FormFields';
import { useHosts } from '../Home/hooks/useHosts';

const BecomeAHost: FC = () => {
  const { data } = useHosts();
  console.log('data', data);

  return (
    <Layout>
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="lg">Try Hosting</Heading>
          <Heading size="md">Complete your host profile and start to connect with people</Heading>
        </VStack>
        <FormProvider onSubmit={() => {}}>
          <FormFields />
        </FormProvider>
      </VStack>
    </Layout>
  );
};

export { BecomeAHost };
