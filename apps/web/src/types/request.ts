import { Host } from './host';
import { Message } from './message';

export interface Request {
  _id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  host: Host;
  messages: Message[];
}
