import { FormControl, FormLabel, FormErrorMessage, FormControlProps } from '@chakra-ui/react';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
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
  const {
    field: { onChange, ...restField },
    fieldState,
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  // eslint-disable-next-line
  const handleOnChange = (place: any) => {
    if (place) {
      geocodeByAddress(place.label).then((results) =>
        getLatLng(results[0]).then(({ lat, lng }) => {
          onChange({ ...place, lat, lng });
        }),
      );
    } else {
      onChange(place);
    }
  };

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} isRequired={isRequired} marginBottom="4">
      {label && (
        <FormLabel htmlFor={name} fontSize={size ?? 'sm'}>
          {label}
        </FormLabel>
      )}
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_MAPS_API_KEY}
        selectProps={{
          ...restField,
          onChange: handleOnChange,
          isClearable: true,
          placeholder,
        }}
      />
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { GooglePlacesAutocompleteField };
