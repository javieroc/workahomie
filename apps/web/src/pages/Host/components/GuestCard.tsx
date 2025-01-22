import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

const GuestCard: FC = () => {
  return (
    <Flex
      gap={4}
      _hover={{ backgroundColor: 'purple.100', cursor: 'pointer', borderRadius: 8 }}
      padding={4}
    >
      <Image
        borderRadius="full"
        boxSize="50px"
        objectFit="cover"
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />
      <Flex flexDirection="column" justifyContent="center">
        <Heading size="xs">The perfect latte</Heading>
        <Text fontSize="xs" color="gray.500">
          Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.
        </Text>
      </Flex>
    </Flex>
  );
};

export { GuestCard };
