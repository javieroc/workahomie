import { FormControl, FormLabel, FormErrorMessage, FormControlProps } from '@chakra-ui/react';
import Autocomplete from 'react-google-autocomplete';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type GooglePlacesAutocompleteProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    placeholder?: string;
  };

function GooglePlacesAutocomplete<T extends FieldValues>({
  name,
  label,
  // placeholder = 'Find an address',
  control,
  isRequired,
  size,
  ...rest
}: GooglePlacesAutocompleteProps<T>) {
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
      <Autocomplete
        apiKey={import.meta.env.VITE_MAPS_API_KEY}
        defaultValue={field.value}
        onPlaceSelected={field.onChange}
        ref={field.ref}
        options={{
          types: ['address'],
        }}
      />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { GooglePlacesAutocomplete };
