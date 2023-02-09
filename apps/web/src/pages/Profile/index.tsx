import { FC } from 'react';
import { Heading, Skeleton, VStack } from '@chakra-ui/react';
import { FormProvider, Layout } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';
import { Host } from 'src/types';
import { FormFields } from '../TryHosting/components/FormFields';
import { useUpdateProfile } from './hooks/useUpdateProfile';

const Profile: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { mutate: updateProfile } = useUpdateProfile();

  return (
    <Layout>
      {hostMe ? (
        <VStack spacing={8} align="flex-start" padding={4}>
          <VStack align="flex-start">
            <Skeleton isLoaded={!isLoading}>
              <Heading size="lg">Profile</Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Heading size="md">Update your host information here</Heading>
            </Skeleton>
          </VStack>
          <Skeleton isLoaded={!isLoading}>
            <FormProvider<Host>
              onSubmit={updateProfile}
              defaultValues={{
                firstName: hostMe.firstName,
                lastName: hostMe.lastName,
                occupation: hostMe.occupation,
                aboutMe: hostMe.aboutMe,
              }}
            >
              <FormFields profileUrl={hostMe.profileImages[0]} />
            </FormProvider>
          </Skeleton>
        </VStack>
      ) : (
        <Navigate to="/try-hosting" />
      )}
    </Layout>
  );
};

export { Profile };
