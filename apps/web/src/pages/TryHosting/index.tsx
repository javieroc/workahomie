import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider, Layout, Loading } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';
import { FormFields } from './components/FormFields';
import { useTryHosting } from './hooks/useTryHosting';

const TryHosting: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { mutate: createHost } = useTryHosting();

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : !hostMe ? (
        <VStack spacing={8} align="flex-start" padding={4}>
          <VStack align="flex-start">
            <Heading size="lg">Try Hosting</Heading>
            <Heading size="md">Complete your host profile and start to connect with people</Heading>
          </VStack>
          <FormProvider onSubmit={createHost}>
            <FormFields />
          </FormProvider>
        </VStack>
      ) : (
        <Navigate to="/host/profile" />
      )}
    </Layout>
  );
};

export { TryHosting };
