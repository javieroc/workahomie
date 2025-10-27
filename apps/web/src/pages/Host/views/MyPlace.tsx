import { FC } from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import { FormProvider } from 'src/components';
import { Host } from 'src/types';
import { PlaceFormFields } from '../components/PlaceFormFields';
import { useUpdatePlace } from '../hooks/useUpdatePlace';
import { UpdateHostPlaceFormValues } from '../types';
import { WithHostMe } from '../HOCs/WithHostMe';

interface MyPlaceWithHostProps {
  host: Host;
}

const MyPlaceWithHost: FC<MyPlaceWithHostProps> = ({ host }) => {
  const { mutate: updatePlace } = useUpdatePlace();

  return (
    <VStack spacing={8} align="flex-start" padding={4}>
      <VStack align="flex-start">
        <Heading size="md">My Place</Heading>
        <Heading size="sm">Update your workspace information here</Heading>
      </VStack>
      <FormProvider<UpdateHostPlaceFormValues>
        onSubmit={(formValues) => {
          updatePlace(formValues);
        }}
        defaultValues={{
          address: host.addressObj,
          placeDescription: host.placeDescription,
          placeDetails: host.placeDetails,
          facilities: host.facilities,
          pictures: [new File([''], ''), new File([''], ''), new File([''], '')],
        }}
      >
        <PlaceFormFields previewPicturesUrl={host.pictures} />
      </FormProvider>
    </VStack>
  );
};

const MyPlace = WithHostMe(MyPlaceWithHost);

export { MyPlace };
