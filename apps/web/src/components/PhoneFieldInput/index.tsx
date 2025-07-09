import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type PhoneFieldInputProps = FormControlProps & UseControllerProps;

const PhoneFieldInput: FC<PhoneFieldInputProps> = ({
  name,
  label,
  control,
  isRequired,
  size,
  ...rest
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} isRequired={isRequired} marginBottom="4">
      {label && (
        <FormLabel htmlFor={name} fontSize={size ?? 'sm'}>
          {label}
        </FormLabel>
      )}
      <PhoneInput {...field} international defaultCountry="IE" inputComponent={Input} />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export { PhoneFieldInput };
