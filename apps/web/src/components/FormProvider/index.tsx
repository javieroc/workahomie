import { Button } from '@chakra-ui/react';
import { PropsWithChildren, ReactElement, useEffect } from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider as FormProviderRhf,
  useForm,
} from 'react-hook-form';

type FormProviderProps<Payload extends FieldValues> = {
  onSubmit: (formValues: Payload) => void;
  defaultValues?: DefaultValues<Payload> | undefined;
  submitButton?: ReactElement;
};

const FormProvider = <Payload extends FieldValues>({
  onSubmit,
  defaultValues,
  children,
  submitButton,
}: PropsWithChildren<FormProviderProps<Payload>>) => {
  const methods = useForm<Payload>({
    defaultValues,
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProviderRhf {...methods}>
      <form
        onSubmit={handleSubmit((formValues) => {
          onSubmit(formValues);
        })}
      >
        {children}
        {submitButton || (
          <Button color="white" colorScheme="purple" type="submit">
            Save
          </Button>
        )}
      </form>
    </FormProviderRhf>
  );
};

export { FormProvider };
