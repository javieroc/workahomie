import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider } from 'src/components';
import { FormFields } from 'src/pages/TryHosting/components/FormFields';
import { Host } from 'src/types';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { UpdateHostDto } from '../types';
import { WithHostMe } from '../HOCs/WithHostMe';

interface ProfileWithHostProps {
  host: Host;
}

const ProfileWithHost: FC<ProfileWithHostProps> = ({ host }) => {
  const { mutate: updateProfile } = useUpdateProfile();

  return (
    <VStack spacing={8} align="flex-start" padding={4}>
      <VStack align="flex-start">
        <Heading size="md">Profile</Heading>
        <Heading size="sm">Update your host information here</Heading>
      </VStack>
      <FormProvider<UpdateHostDto>
        onSubmit={updateProfile}
        defaultValues={{
          firstName: host.firstName,
          lastName: host.lastName,
          occupation: host.occupation,
          aboutMe: host.aboutMe,
          phone: host.phone,
          occupationDescription: host.occupationDescription,
        }}
      >
        <FormFields profileUrl={host.profileImages[0]} />
      </FormProvider>
    </VStack>
  );
};

const Profile = WithHostMe(ProfileWithHost);
export { Profile };
