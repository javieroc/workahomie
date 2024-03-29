import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControlProps,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type TextFieldInputProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    withAs?: 'input' | 'textarea';
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
  };

function TextFieldInput<T extends FieldValues>({
  name,
  label,
  placeholder = 'Some text',
  control,
  isRequired,
  withAs = 'input',
  type = 'text',
  size,
  ...rest
}: TextFieldInputProps<T>) {
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
      {withAs === 'input' ? (
        <Input type={type} id={name} placeholder={placeholder} {...field} size={size ?? 'sm'} />
      ) : (
        <Textarea id={name} placeholder={placeholder} {...field} size={size ?? 'sm'} />
      )}
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { TextFieldInput };
