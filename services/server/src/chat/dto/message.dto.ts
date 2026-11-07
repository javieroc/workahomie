export const MAX_MESSAGE_LENGTH = 2000;

/** `send_message` payload. userId comes from the socket's verified token; timeSent is set server-side. */
export interface SendMessagePayload {
  requestId: string;
  message: string;
  /** Display-only (Auth0 access tokens carry no profile claims). */
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
}

export interface CreateMessageInput {
  requestId: string;
  userId: string;
  message: string;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
}

/** Shape emitted with `new_message`. */
export interface ChatMessage {
  _id: string;
  requestId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  message: string;
  timeSent: string;
}
