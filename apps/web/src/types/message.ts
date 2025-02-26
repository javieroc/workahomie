export interface Message {
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  message: string;
  timeSent?: string;
  isSender?: boolean;
}
