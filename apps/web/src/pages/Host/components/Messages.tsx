import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { Message } from 'src/types';
import { ChatMessage } from './ChatMessage';

interface ChatBoxProps {
  messages: Message[];
}

const Messages: FC<ChatBoxProps> = ({ messages }) => {
  return (
    <Flex
      flex={1}
      flexDirection="column-reverse"
      gap={4}
      padding={4}
      justify="space-between"
      overflowY="scroll"
      height="80vh"
    >
      {messages?.map((message, index) => <ChatMessage key={index} message={message} />)}
    </Flex>
  );
};

export { Messages };
