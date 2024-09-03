import axios from 'axios';
import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Box, Input, List, ListItem, Spinner, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useDebounced } from 'src/hooks';

interface Address {
  display_name: string;
  lat: number;
  lon: number;
  place_id: string;
}

interface OSMSearchInputProps {
  size?: 'lg' | 'md';
  onClick: (search: Address) => void;
}

const OSMSearchInput: React.FC<OSMSearchInputProps> = ({ onClick, size }) => {
  const [search, setSearch] = useState<Address | undefined>();
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounced(query, 300);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isSelecting = useRef(false);

  useEffect(() => {
    if (isSelecting.current) {
      isSelecting.current = false;
      return;
    }

    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 3) {
        setLoading(true);
        try {
          const response = await axios.get<Address[]>(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: {
                format: 'json',
                q: debouncedQuery,
                addressdetails: 1,
                limit: 10,
                featuretype: 'city|town|village',
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
  }, [debouncedQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (suggestion: Address) => {
    isSelecting.current = true;
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setSearch(suggestion);
  };

  const handleOnClick = () => {
    if (search) {
      onClick(search);
    }
  };

  return (
    <Box position="relative" width={['300px', '400px']}>
      <Box display="flex" alignItems="center">
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a Address"
          size={size ?? ['sm', 'lg']}
          p={['1rem', '1.5rem']}
          backgroundColor="white"
        />
        <IconButton
          onClick={handleOnClick}
          colorScheme="pink"
          isRound
          size={size ?? ['xs', 'md']}
          position="absolute"
          right="1rem"
          aria-label="Search database"
          icon={<SearchIcon fontSize={['xs', 'md']} />}
        />
      </Box>
      {loading && <Spinner size="sm" mt={2} />}
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
  );
};

export { OSMSearchInput };
