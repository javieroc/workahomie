import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
  CheckboxGroup,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type OptionItem = {
  label: string;
  value: string;
};

type CheckboxFieldInputProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    options: OptionItem[];
  };

const CheckboxFieldInput = <T extends FieldValues>({
  name,
  label,
  control,
  isRequired,
  size,
  options,
  ...rest
}: CheckboxFieldInputProps<T>) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} isRequired={isRequired} marginBottom="4">
      <FormLabel htmlFor={name} fontSize={size ?? 'sm'}>
        {label}
      </FormLabel>
      <CheckboxGroup {...field}>
        <VStack align="flex-start">
          {options?.map((option) => (
            <Checkbox key={option.value} value={option.value} size={size ?? 'sm'}>
              {option.label}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export { CheckboxFieldInput };
