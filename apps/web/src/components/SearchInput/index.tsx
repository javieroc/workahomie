import { SearchIcon } from '@chakra-ui/icons';
import { IconButton, Stack } from '@chakra-ui/react';
import { FC, useState } from 'react';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';

type Address = {
  label: string;
  lat: number;
  lng: number;
  value: {
    description: string;
    place_id: string;
  };
};

interface SearchInputProps {
  size?: 'xl' | 'md';
  onClick: (search: Address) => void;
}

const SearchInput: FC<SearchInputProps> = ({ size = 'xl', onClick }) => {
  const [search, setSearch] = useState<Address | undefined>();

  // eslint-disable-next-line
  const handleOnChange = (place: any) => {
    if (place) {
      geocodeByAddress(place.label).then((results) =>
        getLatLng(results[0]).then(({ lat, lng }) => {
          setSearch({ ...place, lat, lng });
        }),
      );
    } else {
      setSearch(place);
    }
  };

  const handleOnClick = () => {
    if (search) {
      onClick(search);
    }
  };

  return (
    <Stack direction="row" alignItems="center" width="400px">
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_MAPS_API_KEY}
        selectProps={{
          onChange: handleOnChange,
          value: search,
          isClearable: true,
          placeholder: 'Where are you going?',
          styles: {
            input: (provided) => ({
              ...provided,
              width: size === 'xl' ? '400px' : '360px',
              height: size === 'xl' ? '48px' : '40px',
              borderRadius: '50px',
              fontSize: size === 'xl' ? '24px' : '20px',
            }),
            control: (provided) => ({
              ...provided,
              borderRadius: '12px',
              borderColor: '#CBD5E0',
              '&:hover': {
                borderColor: '#CBD5E0',
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: size === 'xl' ? '24px' : '20px',
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              '& svg': { display: 'none' },
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              display: 'none',
            }),
            placeholder: (provided) => ({
              ...provided,
              fontSize: size === 'xl' ? '24px' : '20px',
            }),
          },
        }}
      />
      <IconButton
        onClick={handleOnClick}
        colorScheme="pink"
        isRound
        size="md"
        aria-label="Search database"
        icon={<SearchIcon fontSize="md" />}
      />
    </Stack>
  );
};

export { SearchInput };
