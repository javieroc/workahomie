import { FC } from 'react';
import {
  Button,
  Heading,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import HeroImage from 'src/assets/hero.jpeg';
import { SearchIcon } from '@chakra-ui/icons';

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
          Looking for a partner?
        </Heading>
        <InputGroup size="lg">
          <Input
            placeholder="Where are you going?"
            backgroundColor="white"
            borderColor="gray.400"
            borderRadius="25px"
            size="lg"
          />
          <InputRightElement right="8px">
            <Button colorScheme="pink" borderRadius="50%" width="40px" height="40px">
              <SearchIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
    </Flex>
  );
};

export { Hero };
