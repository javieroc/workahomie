import { FC } from 'react';
import { Heading, Flex, VStack } from '@chakra-ui/react';
import HeroImage from 'src/assets/hero.jpeg';
import { SearchInput } from '../SearchInput';

const Hero: FC = () => {
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
        <SearchInput />
      </VStack>
    </Flex>
  );
};

export { Hero };
