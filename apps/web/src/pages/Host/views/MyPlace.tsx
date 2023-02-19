import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider, Loading } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';
import { Host } from 'src/types';
import { FormFields } from 'src/pages/TryHosting/components/FormFields';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const MyPlace: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { mutate: updateProfile } = useUpdateProfile();

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return (
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="lg">Profile</Heading>
          <Heading size="md">Update your host information here</Heading>
        </VStack>
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
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { MyPlace };
