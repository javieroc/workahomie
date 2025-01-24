import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Message } from 'src/types';
import { ChatMessage } from './ChatMessage';

interface ChatBoxProps {
  messages: Message[];
}

const ChatBox: FC<ChatBoxProps> = ({ messages }) => {
  return (
    <Flex flexDirection="column" gap={4} padding={4}>
      {messages.map((message) => (
        <ChatMessage key={message.timeSent} message={message} />
      ))}
    </Flex>
  );
};

export { ChatBox };
