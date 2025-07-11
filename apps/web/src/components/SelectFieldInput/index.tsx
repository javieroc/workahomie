import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

interface SelectFieldInputProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  size?: 'sm' | 'md' | 'lg';
}

const SelectFieldInput: FC<SelectFieldInputProps> = ({ name, label, options, size }) => {
  const { control } = useFormContext();

  return (
    <FormControl marginBottom="4">
      <FormLabel htmlFor={name} fontSize={size}>
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Select {...field} id={name} placeholder={`Select ${label}`}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          </>
        )}
      />
    </FormControl>
  );
};

export { SelectFieldInput };
