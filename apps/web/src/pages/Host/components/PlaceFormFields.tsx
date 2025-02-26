import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CheckboxFieldInput,
  FilesUpload,
  OSMPlacesAutocompleteField,
  TextFieldInput,
} from 'src/components';

type FormFieldsProps = {
  previewPicturesUrl?: string[];
};

const PlaceFormFields: FC<FormFieldsProps> = ({ previewPicturesUrl }) => {
  const { control } = useFormContext();
  return (
    <>
      <FilesUpload name="pictures" control={control} urls={previewPicturesUrl} />
      <TextFieldInput
        name="placeDescription"
        label="Description/Title"
        placeholder="Description/Title"
        isRequired
        size="md"
      />
      <TextFieldInput
        name="placeDetails"
        label="Description Details"
        placeholder="Write something..."
        withAs="textarea"
        size="md"
      />
      <OSMPlacesAutocompleteField name="address" label="Address" isRequired size="md" />
      <CheckboxFieldInput
        label="Facilities"
        name="facilities"
        options={[
          { label: 'Wifi', value: 'wifi' },
          { label: 'Coffee', value: 'coffee' },
          { label: 'Parking', value: 'parking' },
          { label: 'Snacks', value: 'snacks' },
        ]}
        size="md"
      />
    </>
  );
};

export { PlaceFormFields };
