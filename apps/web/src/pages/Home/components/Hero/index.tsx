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
      <VStack
        alignItems="center"
        spacing="16px"
        backgroundColor="rgba(255,255,255,0.5)"
        padding="24px"
        borderRadius="lg"
      >
        <Heading size="xl" color="gray.800" textAlign="center">
          Work Together, From Home.
        </Heading>
        <Heading size="md" color="gray.800" textAlign="center">
          Find or share a free workspace in your community.
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
