import { FC } from 'react';
import { Button, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import TryHostingImage from 'src/assets/try-hosting.png';
import { Link } from 'react-router-dom';

const TryHosting: FC = () => {
  return (
    <Flex
      width="100%"
      backgroundColor="gray.100"
      align="center"
      justifyContent="center"
      padding={{ base: '16px', lg: '64px' }}
    >
      <HStack spacing="24px" align="flex-end" backgroundColor="white" borderRadius="24px">
        <VStack align={['center', 'flex-start']} padding="58px">
          <Heading>Try Hosting</Heading>
          <Text fontSize="xl">
            Share your space and spark new connections. Build your network by hosting fellow
            professionals for free.
          </Text>
          <Link to="/try-hosting">
            <Button colorScheme="purple" variant="outline">
              Learn More
            </Button>
          </Link>
        </VStack>
        <Image
          display={['none', 'flex']}
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
