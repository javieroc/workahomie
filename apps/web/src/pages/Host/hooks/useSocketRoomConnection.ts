import { User } from '@auth0/auth0-react';
import { useEffect, useState, useCallback } from 'react';
import { getSocket, initSocket } from 'src/socket';
import { Message } from 'src/types';

interface UseSocketRoomConnectionProps {
  requestId: string;
  initialMessages: Message[];
  user?: User;
  isAuthenticated: boolean;
  getAccessTokenSilently: () => Promise<string>;
}

export const useSocketRoomConnection = ({
  requestId,
  initialMessages,
  user,
  isAuthenticated,
  getAccessTokenSilently,
}: UseSocketRoomConnectionProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    if (!isAuthenticated) return;

    let socketCleanup: (() => void) | undefined;

    (async () => {
      const token = await getAccessTokenSilently();
      const socket = initSocket(token);

      socket.off('new_message');

      socket.on('new_message', (message: Message & { requestId: string }) => {
        if (message.requestId === requestId) {
          const isSender = message.userId === user?.sub?.split('|')[1];
          setMessages((prev) => [...prev, { ...message, isSender }]);
        }
      });

      socket.emit('join_room', requestId);

      socketCleanup = () => {
        try {
          socket.emit('leave_room', requestId);
        } catch {
          // ignore
        }
        socket.off('new_message');
      };
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      socketCleanup?.();
    };
  }, [isAuthenticated, requestId, user?.sub, getAccessTokenSilently]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const sendMessage = useCallback(
    (text: string) => {
      const socket = getSocket();
      if (!socket) return;

      const newMessage: Message & { requestId: string } = {
        message: text,
        userId: user?.sub?.split('|')[1],
        userEmail: user?.email,
        userName: user?.name,
        userAvatar: user?.picture,
        requestId,
      };

      socket.emit('send_message', newMessage);
    },
    [user, requestId],
  );

  return { messages, sendMessage };
};
