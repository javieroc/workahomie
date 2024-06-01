import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider, Loading } from 'src/components';
import { useHostMe } from 'src/hooks/useHostMe';
import { Navigate } from 'react-router-dom';
import { PlaceFormFields } from '../components/PlaceFormFields';
import { useUpdatePlace } from '../hooks/useUpdatePlace';
import { UpdateHostPlaceFormValues } from '../types';

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
        <FormProvider<UpdateHostPlaceFormValues>
          onSubmit={(formValues) => {
            updatePlace(formValues);
          }}
          defaultValues={{
            address: hostMe.addressObj,
            placeDescription: hostMe.placeDescription,
            placeDetails: hostMe.placeDetails,
            facilities: hostMe.facilities,
            pictures: [new File([''], ''), new File([''], ''), new File([''], '')],
          }}
        >
          <PlaceFormFields previewPicturesUrl={hostMe.pictures} />
        </FormProvider>
      </VStack>
    );
  }

  return <Navigate to="/try-hosting" />;
};

export { MyPlace };
