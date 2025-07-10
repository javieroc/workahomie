import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FileUpload, PhoneFieldInput, SelectFieldInput, TextFieldInput } from 'src/components';
import { OCCUPATIONS } from 'src/constants/occupations';

type FormFieldsProps = {
  profileUrl?: string;
};

const FormFields: FC<FormFieldsProps> = ({ profileUrl }) => {
  const { control } = useFormContext();
  const occupation = useWatch({ control, name: 'occupation' });

  return (
    <>
      <FileUpload
        label="Profile Image"
        name="profile"
        placeholder="Profile"
        size="md"
        url={profileUrl}
      />
      <TextFieldInput name="firstName" label="First Name" placeholder="First Name" size="md" />
      <TextFieldInput name="lastName" label="Last Name" placeholder="Last Name" size="md" />
      <SelectFieldInput
        name="occupation"
        label="Occupation"
        options={OCCUPATIONS.map((o) => ({ value: o.name, label: o.name }))}
        size="md"
      />
      {occupation === 'Others' && (
        <TextFieldInput
          name="occupationDescription"
          label="Other Occupation"
          placeholder="Describe your occupation"
          size="md"
        />
      )}
      <PhoneFieldInput name="phone" />
      <TextFieldInput
        name="aboutMe"
        label="About me"
        placeholder="Write something..."
        withAs="textarea"
        size="md"
      />
    </>
  );
};

export { FormFields };
