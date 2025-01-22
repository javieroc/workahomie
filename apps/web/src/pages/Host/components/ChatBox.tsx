import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { ChatMessage } from './ChatMessage';

const ChatBox: FC = () => {
  return (
    <Flex flexDirection="column" gap={4} padding={4}>
      <ChatMessage isSender={false} />
      <ChatMessage isSender={false} />
      <ChatMessage />
      <ChatMessage isSender={false} />
      <ChatMessage />
      <ChatMessage />
    </Flex>
  );
};

export { ChatBox };
