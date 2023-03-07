import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider, Loading } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';
import { PlaceFormFields } from '../components/PlaceFormFields';
import { useUpdatePlace } from '../hooks/useUpdatePlace';
import { UpdateHostPlaceDto } from '../types';

const MyPlace: FC = () => {
  const { data: hostMe, isLoading } = useHostMe();
  const { mutate: updatePlace } = useUpdatePlace();

  if (isLoading) {
    return <Loading />;
  }

  if (hostMe) {
    return (
      <VStack spacing={8} align="flex-start" padding={4}>
        <VStack align="flex-start">
          <Heading size="lg">My Place</Heading>
          <Heading size="md">Update your workspace information here</Heading>
        </VStack>
        <FormProvider<UpdateHostPlaceDto>
          onSubmit={updatePlace}
          defaultValues={{
            address: hostMe.place.address,
            description: hostMe.place.description,
            details: hostMe.place.details,
            facilities: hostMe.place.facilities,
          }}
        >
          <PlaceFormFields />
        </FormProvider>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { MyPlace };
