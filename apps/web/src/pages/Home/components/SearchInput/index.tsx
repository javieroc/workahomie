import { createSearchParams, useNavigate } from 'react-router-dom';
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

const SearchInput: FC = () => {
  const [search, setSearch] = useState<Address | undefined>();
  const navigate = useNavigate();

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
      navigate({
        pathname: 'hosts',
        search: createSearchParams({
          search: search.label,
          lat: search.lat.toString(),
          lng: search.lng.toString(),
          place_id: search.value.place_id,
        }).toString(),
      });
    }
  };

  return (
    <Stack direction="row" alignItems="center">
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
              width: '400px',
              height: '48px',
              borderRadius: '50px',
              fontSize: '24px',
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
              fontSize: '24px',
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
              fontSize: '24px',
            }),
          },
        }}
      />
      <IconButton
        onClick={handleOnClick}
        colorScheme="pink"
        isRound
        size="lg"
        aria-label="Search database"
        icon={<SearchIcon fontSize="xl" />}
      />
    </Stack>
  );
};

export { SearchInput };
