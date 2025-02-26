import { FC } from 'react';
import { Card, CardBody, Heading } from '@chakra-ui/react';
import { DateRangeInputField, FormProvider, TextFieldInput } from 'src/components';
import { useSendRequest } from 'src/pages/Hosts/hooks';
import { CreateRequestDto } from 'src/pages/Hosts/types';
import { useNotification } from 'src/hooks/useNotification';

interface RequestFormProps {
  hostId: string;
}

const RequestForm: FC<RequestFormProps> = ({ hostId }) => {
  const notification = useNotification();

  const { mutate: sendRequest } = useSendRequest(hostId, {
    onSuccess: () => {
      notification({
        title: 'Request',
        description: 'Your request was sent!',
        status: 'success',
      });
    },
  });

  return (
    <Card variant="outline" size={['sm', 'lg']} width="100%">
      <CardBody>
        <Heading size={['sm', 'md']} marginBottom={8}>
          Request to Stay
        </Heading>
        <FormProvider<CreateRequestDto> onSubmit={(formValues) => sendRequest(formValues)}>
          <DateRangeInputField
            startName="checkIn"
            startLabel="Check-In"
            endName="checkOut"
            endLabel="Check-Out"
            size="lg"
          />
          <TextFieldInput
            label="Message"
            name="message"
            withAs="textarea"
            placeholder="Write your message..."
            size={['md', 'lg']}
          />
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export { RequestForm };
