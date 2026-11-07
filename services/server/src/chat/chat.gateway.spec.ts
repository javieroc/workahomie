import { Types } from 'mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

const REQUEST_ID = new Types.ObjectId().toString();
const participants = { requesterId: 'guest', hostOwnerId: 'host-owner' };

function setup(userId: string | null = 'guest') {
  const chatService = {
    getParticipants: jest.fn().mockResolvedValue(participants),
    isParticipant: ChatService.prototype.isParticipant,
    create: jest.fn(async (input) => ({
      _id: new Types.ObjectId().toString(),
      ...input,
      timeSent: '2026-11-06T12:00:00.000Z',
    })),
    notifyRecipient: jest.fn().mockResolvedValue(undefined),
  };
  const tokenVerifier = { verify: jest.fn() };
  const gateway = new ChatGateway(chatService as never, tokenVerifier as never);
  const emit = jest.fn();
  gateway.server = { to: jest.fn(() => ({ emit })) } as never;
  const client = {
    id: 'socket-1',
    data: { user: userId ? { sub: `auth0|${userId}` } : undefined },
    join: jest.fn(),
    leave: jest.fn(),
    emit: jest.fn(),
    handshake: { auth: {} },
  };
  return { gateway, chatService, tokenVerifier, client, emit };
}

describe('ChatGateway', () => {
  describe('join_room', () => {
    it.each(['guest', 'host-owner'])('lets the %s join', async (userId) => {
      const { gateway, client } = setup(userId);
      await expect(gateway.handleJoinRoom(REQUEST_ID, client as never)).resolves.toEqual({
        ok: true,
      });
      expect(client.join).toHaveBeenCalledWith(REQUEST_ID);
    });

    it('rejects users that are not part of the request', async () => {
      const { gateway, client } = setup('stranger');
      await expect(gateway.handleJoinRoom(REQUEST_ID, client as never)).resolves.toEqual({
        ok: false,
        error: 'Forbidden',
      });
      expect(client.join).not.toHaveBeenCalled();
    });

    it('rejects unknown rooms and invalid ids', async () => {
      const { gateway, client, chatService } = setup();
      chatService.getParticipants.mockResolvedValue(null);
      await expect(gateway.handleJoinRoom(REQUEST_ID, client as never)).resolves.toMatchObject({
        ok: false,
      });
      await expect(gateway.handleJoinRoom('not-an-id', client as never)).resolves.toEqual({
        ok: false,
        error: 'Invalid room',
      });
      expect(client.join).not.toHaveBeenCalled();
    });

    it('rejects unauthenticated sockets', async () => {
      const { gateway, client } = setup(null);
      await expect(gateway.handleJoinRoom(REQUEST_ID, client as never)).resolves.toEqual({
        ok: false,
        error: 'Unauthorized',
      });
    });
  });

  describe('send_message', () => {
    it('ignores a spoofed userId, saves and broadcasts to the whole room once', async () => {
      const { gateway, client, chatService, emit } = setup('guest');
      const payload = { requestId: REQUEST_ID, message: '  hello  ', userId: 'host-owner' };

      const ack = await gateway.handleSendMessage(payload as never, client as never);

      expect(ack.ok).toBe(true);
      expect(chatService.create).toHaveBeenCalledWith(
        expect.objectContaining({ requestId: REQUEST_ID, userId: 'guest', message: 'hello' }),
      );
      expect(gateway.server.to).toHaveBeenCalledWith(REQUEST_ID);
      expect(emit).toHaveBeenCalledTimes(1);
      expect(emit).toHaveBeenCalledWith(
        'new_message',
        expect.objectContaining({ userId: 'guest', timeSent: expect.any(String) }),
      );
      expect(client.emit).not.toHaveBeenCalled();
      expect(chatService.notifyRecipient).toHaveBeenCalled();
    });

    it('rejects non-members', async () => {
      const { gateway, client, chatService, emit } = setup('stranger');
      const ack = await gateway.handleSendMessage(
        { requestId: REQUEST_ID, message: 'hi' },
        client as never,
      );
      expect(ack).toEqual({ ok: false, error: 'Forbidden' });
      expect(chatService.create).not.toHaveBeenCalled();
      expect(emit).not.toHaveBeenCalled();
    });

    it('rejects empty and too long messages', async () => {
      const { gateway, client, chatService } = setup('guest');
      await expect(
        gateway.handleSendMessage({ requestId: REQUEST_ID, message: '   ' }, client as never),
      ).resolves.toMatchObject({ ok: false });
      await expect(
        gateway.handleSendMessage(
          { requestId: REQUEST_ID, message: 'x'.repeat(2001) },
          client as never,
        ),
      ).resolves.toMatchObject({ ok: false });
      expect(chatService.create).not.toHaveBeenCalled();
    });
  });

  describe('auth middleware', () => {
    it('rejects sockets without a valid token and attaches the user otherwise', async () => {
      const { gateway, tokenVerifier } = setup();
      const next = jest.fn();

      await gateway.authMiddleware({ id: 's', handshake: { auth: {} }, data: {} } as never, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));

      tokenVerifier.verify.mockRejectedValueOnce(new Error('bad signature'));
      await gateway.authMiddleware(
        { id: 's', handshake: { auth: { token: 'bad' } }, data: {} } as never,
        next,
      );
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));

      const socket = { id: 's', handshake: { auth: { token: 'good' } }, data: {} as never };
      tokenVerifier.verify.mockResolvedValueOnce({ sub: 'auth0|guest' });
      await gateway.authMiddleware(socket as never, next);
      expect(next).toHaveBeenLastCalledWith();
      expect(socket.data).toEqual({ user: { sub: 'auth0|guest' } });
    });
  });
});
