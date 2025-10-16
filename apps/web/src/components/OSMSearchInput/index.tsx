import axios from 'axios';
import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Box, Input, List, ListItem, Spinner, IconButton, HStack } from '@chakra-ui/react';
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

const OSMSearchInput: React.FC<OSMSearchInputProps> = ({ onClick, size = 'md' }) => {
  const [search, setSearch] = useState<Address | undefined>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query, 300);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
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
          const { data } = await axios.get<Address[]>(
            'https://nominatim.openstreetmap.org/search',
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
          setSuggestions(data);
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
    if (search) onClick(search);
  };

  return (
    <Box position="relative" width={['300px', '400px', '450px']}>
      <HStack spacing={2}>
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder="Search for an address"
          size={size}
          bg="white"
          borderRadius="md"
          px={4}
          py={2}
          _focus={{ borderColor: 'pink.400', boxShadow: '0 0 0 1px var(--chakra-colors-pink-400)' }}
        />
        <IconButton
          onClick={handleOnClick}
          colorScheme="pink"
          isRound
          size={size}
          aria-label="Search address"
          icon={<SearchIcon />}
        />
      </HStack>

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
          width="100%"
        >
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              p={2}
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
