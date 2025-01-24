import { Flex, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { Message } from 'src/types';

interface ChatMessageProps {
  message: Message & { isSender?: boolean };
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const { isSender, userAvatar, message: text } = message;
  return (
    <Flex
      gap={4}
      padding={4}
      alignItems="center"
      flexDirection={isSender ? 'row-reverse' : 'row'}
      textAlign={isSender ? 'right' : 'left'}
    >
      <Image
        borderRadius="full"
        boxSize="50px"
        objectFit="cover"
        src={
          userAvatar ??
          'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
        }
        alt="User Avatar"
      />
      <Text
        fontSize="sm"
        padding={2}
        borderRadius={8}
        backgroundColor={isSender ? 'purple.100' : 'gray.100'}
      >
        {text}
      </Text>
    </Flex>
  );
};

export { ChatMessage };
