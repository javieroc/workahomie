import { FormControl, FormLabel, FormErrorMessage, FormControlProps } from '@chakra-ui/react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type GooglePlacesAutocompleteFieldProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    placeholder?: string;
  };

function GooglePlacesAutocompleteField<T extends FieldValues>({
  name,
  label,
  placeholder = 'Find an address',
  control,
  isRequired,
  size,
  ...rest
}: GooglePlacesAutocompleteFieldProps<T>) {
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
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_MAPS_API_KEY}
        selectProps={{ ...field, isClearable: true, placeholder }}
      />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { GooglePlacesAutocompleteField };
