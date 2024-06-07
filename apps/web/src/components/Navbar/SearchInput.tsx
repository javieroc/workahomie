import { SearchIcon } from '@chakra-ui/icons';
import { IconButton, Stack } from '@chakra-ui/react';
import { FC, useState } from 'react';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
import { useFilters } from 'src/pages/Hosts/hooks';

type Address = {
  label: string;
  lat: number;
  lng: number;
  value: {
    description: string;
    place_id: string;
  };
};

const SearchInput: FC = () => {
  const [search, setSearch] = useState<Address | undefined>();
  const { setFilters } = useFilters();

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
      setFilters({ lat: search.lat, lng: search.lng });
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
              width: '360px',
              height: '40px',
              borderRadius: '50px',
              fontSize: '20px',
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
              fontSize: '20px',
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
              fontSize: '20px',
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
