import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormControlProps,
  Input,
  List,
  ListItem,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { useDebounced } from 'src/hooks';

interface Address {
  display_name: string;
  lat: number;
  lon: number;
  place_id: string;
}

type OSMPlacesAutocompleteFieldProps<T extends FieldValues> = FormControlProps &
  UseControllerProps<T> & {
    placeholder?: string;
  };

function OSMPlacesAutocompleteField<T extends FieldValues>({
  name,
  label,
  placeholder = 'Find an address',
  control,
  isRequired,
  size,
  ...rest
}: OSMPlacesAutocompleteFieldProps<T>) {
  const {
    field: { onChange, value, ...restField },
    fieldState,
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const initialValue = useRef(value?.display_name || '');

  const [query, setQuery] = useState(value?.display_name || '');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounced(query, 300);
  const isSelecting = useRef(false);

  useEffect(() => {
    const shouldSearch = query !== initialValue.current;

    if (!shouldSearch) return;

    if (isSelecting.current) {
      isSelecting.current = false;
      return;
    }

    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 3) {
        setLoading(true);
        try {
          const response = await axios.get<Address[]>(
            'https://nominatim.openstreetmap.org/search',
            {
              params: {
                format: 'json',
                q: debouncedQuery,
                addressdetails: 1,
                limit: 10,
                featuretype: 'settlement',
              },
            },
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, query]);

  const handleSelect = (suggestion: Address) => {
    isSelecting.current = true;
    setQuery(suggestion.display_name);
    setSuggestions([]);
    onChange(suggestion);

    initialValue.current = suggestion.display_name;
  };

  return (
    <FormControl isInvalid={!!fieldState.error} {...rest} isRequired={isRequired} marginBottom="4">
      {label && (
        <FormLabel htmlFor={name} fontSize={size ?? 'sm'}>
          {label}
        </FormLabel>
      )}
      <Box position="relative">
        <Input
          {...restField}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder={placeholder}
          size={size ?? 'md'}
        />
        {loading && (
          <Spinner
            size="sm"
            position="absolute"
            right="1rem"
            top="50%"
            transform="translateY(-50%)"
          />
        )}
        {suggestions.length > 0 && (
          <List
            spacing={1}
            mt={2}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="md"
            bg="white"
            maxH="200px"
            position="absolute"
            overflowY="auto"
            zIndex={1000}
            width="100%"
          >
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion)}
                padding="10px"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export { OSMPlacesAutocompleteField };
