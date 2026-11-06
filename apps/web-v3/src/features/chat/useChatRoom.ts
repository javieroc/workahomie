import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { qk } from '@/lib/queryKeys';
import type { Message, StayRequest } from '@/lib/types';
import { useSession } from '@/auth/useSession';

type ConnectionState = 'connecting' | 'online' | 'offline' | 'denied';

/**
 * Joins the request's room and appends incoming messages straight into the
 * TanStack Query cache, so the request detail query stays the single source of truth.
 */
export function useChatRoom(requestId: string) {
  const qc = useQueryClient();
  const { getToken, user } = useSession();
  const [state, setState] = useState<ConnectionState>('connecting');

  useEffect(() => {
    const socket = getSocket(() => getToken());

    const join = () =>
      socket.emit('join_room', requestId, (ack?: { ok: boolean }) => {
        setState(ack && ack.ok === false ? 'denied' : 'online');
      });

    const onMessage = (msg: Message) => {
      if (msg.requestId && msg.requestId !== requestId) return;
      qc.setQueryData<StayRequest>(qk.request(requestId), (prev) => {
        if (!prev) return prev;
        if (msg._id && prev.messages.some((m) => m._id === msg._id)) return prev;
        return { ...prev, messages: [...prev.messages, msg] };
      });
    };
    const onDisconnect = () => setState('offline');

    socket.on('connect', join);
    socket.on('disconnect', onDisconnect);
    socket.on('new_message', onMessage);
    if (socket.connected) join();

    return () => {
      socket.emit('leave_room', requestId);
      socket.off('connect', join);
      socket.off('disconnect', onDisconnect);
      socket.off('new_message', onMessage);
    };
  }, [requestId, getToken, qc]);

  const send = useCallback(
    (text: string) => {
      const message = text.trim();
      if (!message) return;
      getSocket(() => getToken()).emit('send_message', {
        requestId,
        message,
        userName: user?.name,
        userAvatar: user?.picture,
      });
    },
    [requestId, getToken, user],
  );

  return { state, send };
}
