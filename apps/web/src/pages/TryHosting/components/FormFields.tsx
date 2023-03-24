import { FC } from 'react';
import { FileUpload, TextFieldInput } from 'src/components';

type FormFieldsProps = {
  profileUrl?: string;
};

const FormFields: FC<FormFieldsProps> = ({ profileUrl }) => {
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
      <TextFieldInput name="occupation" label="Occupation" placeholder="Occupation" size="md" />
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
