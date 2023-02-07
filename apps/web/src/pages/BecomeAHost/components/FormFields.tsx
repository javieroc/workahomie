import { FC } from 'react';
import { TextFieldInput } from 'src/components';
import { FileUpload } from 'src/components/FileUpload';

const FormFields: FC = () => {
  return (
    <>
      <FileUpload label="Profile Image" name="hostProfile" placeholder="Profile" size="md" />
      <TextFieldInput name="firstName" label="First Name" placeholder="First Name" size="md" />
      <TextFieldInput name="lastName" label="Last Name" placeholder="Last Name" size="md" />
      <TextFieldInput name="Occupation" label="Occupation" placeholder="Occupation" size="md" />
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
