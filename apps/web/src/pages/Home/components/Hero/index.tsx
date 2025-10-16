import { FC } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Heading, Flex, VStack } from '@chakra-ui/react';
import HeroImage from 'src/assets/hero.jpeg';
import { OSMSearchInput } from 'src/components/OSMSearchInput';

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
      <VStack alignItems="center" spacing="16px">
        <Heading size="xl" color="gray.800" textAlign="center">
          Looking for a Co-Worker?
        </Heading>
        <OSMSearchInput
          onClick={(search) => {
            navigate({
              pathname: 'hosts',
              search: createSearchParams({
                search: search.display_name,
                lat: search.lat.toString(),
                lng: search.lon.toString(),
                place_id: search.place_id,
              }).toString(),
            });
          }}
        />
      </VStack>
    </Flex>
  );
};

export { Hero };
