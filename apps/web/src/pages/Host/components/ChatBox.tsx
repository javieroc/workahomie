import { Flex, HStack, IconButton, Input } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Message } from 'src/types';
import { FormProvider, useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import { io, Socket } from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';
import { ChatMessage } from './ChatMessage';

const socket: Socket = io('http://localhost:8000');

interface ChatBoxProps {
  initialMessages: Message[];
}

const ChatBox: FC<ChatBoxProps> = ({ initialMessages }) => {
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const methods = useForm<{ message: string }>();

  const handleSend = (data: { message: string }) => {
    const newMessage: Message = {
      message: data.message,
      userId: user?.sub?.split('|')[1],
      userEmail: user?.email,
      userName: user?.name,
      userAvatar: user?.picture,
    };

    socket.emit('send_message', newMessage);
    methods.reset();
  };

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    socket.on('new_message', (message: Message) => {
      setMessages((prev) => [
        ...prev,
        { ...message, isSender: message.userId === user?.sub?.split('|')[1] },
      ]);
    });

    return () => {
      socket.off('new_message');
    };
  });

  return (
    <Flex flexDirection="column" gap={4} padding={4} justify="space-between">
      {messages?.map((message, index) => <ChatMessage key={index} message={message} />)}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSend)}>
          <HStack spacing={0} borderWidth="1px" borderRadius="md" overflow="hidden">
            <Input
              {...methods.register('message', { required: 'Message is required' })}
              placeholder="Type your message..."
              border="none"
              _focus={{ boxShadow: 'none' }}
            />
            <IconButton
              type="submit"
              aria-label="Send message"
              icon={<FiSend />}
              border="none"
              borderRadius={0}
              borderLeftWidth="1px"
              colorScheme="purple"
              _hover={{ bg: 'purple.600' }}
            />
          </HStack>
        </form>
      </FormProvider>
    </Flex>
  );
};

export { ChatBox };
