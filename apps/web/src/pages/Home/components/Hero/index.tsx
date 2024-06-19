import { FC } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Heading, Flex, VStack } from '@chakra-ui/react';
import HeroImage from 'src/assets/hero.jpeg';
import { SearchInput } from 'src/components';

const Hero: FC = () => {
  const navigate = useNavigate();

  return (
    <Flex
      backgroundImage={`url(${HeroImage})`}
      width="100%"
      height={{ base: '200px', md: '400px' }}
      backgroundSize="cover"
      backgroundPosition="bottom"
      alignItems="center"
      justifyContent="center"
    >
      <VStack width="400px" alignItems="flex-start" spacing="16px">
        <Heading size="lg" color="gray.800">
          Looking for a Co-Worker?
        </Heading>
        <SearchInput
          onClick={(search) => {
            navigate({
              pathname: 'hosts',
              search: createSearchParams({
                search: search.label,
                lat: search.lat.toString(),
                lng: search.lng.toString(),
                place_id: search.value.place_id,
              }).toString(),
            });
          }}
        />
      </VStack>
    </Flex>
  );
};

export { Hero };
