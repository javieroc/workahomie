import { Host, Message, Request } from 'src/types';

export type CreateRequestDto = Pick<Request, 'checkIn' | 'checkOut'> &
  Pick<Message, 'message' | 'userId' | 'userAvatar' | 'userEmail' | 'userName'>;

export interface Review {
  _id: string;
  userName: string;
  userAvatar: string;
  date: string;
  review: string;
  rating: number;
  host: Host;
}
