import { Host } from './host';
import { Message } from './message';

export interface Request {
  _id: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  message: string;
  status: string;
  host: Host;
  messages: Message[];
}
