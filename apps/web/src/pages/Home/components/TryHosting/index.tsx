import { FC } from 'react';
import { Button, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import TryHostingImage from 'src/assets/try-hosting.png';

const TryHosting: FC = () => {
  return (
    <Flex
      width="100%"
      backgroundColor="gray.200"
      align="center"
      justifyContent="center"
      padding={{ base: '16px', lg: '64px' }}
    >
      <HStack spacing="24px" align="flex-end" backgroundColor="white" borderRadius="24px">
        <VStack align="flex-start" padding="58px">
          <Heading>Try Hosting</Heading>
          <Text>What you give is what you receive</Text>
          <Button colorScheme="purple" variant="outline">
            Learn More
          </Button>
        </VStack>
        <Image
          display={{ base: 'none', md: 'flex' }}
          src={TryHostingImage}
          alt="Try Hosting"
          width="512px"
          height="360px"
          borderRadius="24px"
        />
      </HStack>
    </Flex>
  );
};

export { TryHosting };
