import { Flex, HStack, IconButton, Input } from '@chakra-ui/react';
import { FC } from 'react';
import { Message } from 'src/types';
import { FormProvider, useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';
import { Messages } from './Messages';
import { useSocketRoomConnection } from '../hooks';

interface ChatBoxProps {
  requestId: string;
  initialMessages: Message[];
}

const ChatBox: FC<ChatBoxProps> = ({ initialMessages, requestId }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const methods = useForm<{ message: string }>();

  const { messages, sendMessage } = useSocketRoomConnection({
    requestId,
    initialMessages,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  });

  const handleSend = (data: { message: string }) => {
    sendMessage(data.message);
    methods.reset();
  };

  return (
    <Flex
      height="80vh"
      position="relative"
      flex={1}
      flexDirection="column"
      gap={4}
      padding={4}
      justify="space-between"
    >
      <Messages messages={messages} />
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
