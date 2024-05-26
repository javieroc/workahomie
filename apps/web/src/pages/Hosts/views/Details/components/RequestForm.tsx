import { Card, CardBody, Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { DateFieldInput, FormProvider, TextFieldInput } from 'src/components';

const RequestForm: FC = () => {
  return (
    <Card variant="elevated">
      <CardBody>
        <Heading size="md" marginBottom={8}>
          Request to Stay
        </Heading>
        <FormProvider onSubmit={(formValues) => console.log(formValues)}>
          <DateFieldInput label="Check-In" name="check-in" size="lg" />
          <DateFieldInput label="Check-Out" name="check-out" size="lg" />
          <TextFieldInput
            label="Message"
            name="message"
            withAs="textarea"
            placeholder="Write your message..."
            size="lg"
          />
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export { RequestForm };
