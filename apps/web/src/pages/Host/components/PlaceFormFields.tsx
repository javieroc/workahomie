import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckboxFieldInput, FilesUpload, TextFieldInput } from 'src/components';

type FormFieldsProps = {
  previewPicturesUrl?: string[];
};

const PlaceFormFields: FC<FormFieldsProps> = ({ previewPicturesUrl }) => {
  const { control } = useFormContext();
  return (
    <>
      <FilesUpload name="pictures" control={control} urls={previewPicturesUrl} />
      <TextFieldInput
        name="description"
        label="Description/Title"
        placeholder="Description/Title"
        isRequired
        size="md"
      />
      <TextFieldInput
        name="details"
        label="Description Details"
        placeholder="Write something..."
        withAs="textarea"
        size="md"
      />
      <TextFieldInput
        name="address"
        label="Address"
        placeholder="5th Avenue, Street 123"
        isRequired
        size="md"
      />
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
