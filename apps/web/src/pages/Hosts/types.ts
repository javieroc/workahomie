import { Host, Request } from 'src/types';

export type CreateRequestDto = Pick<Request, 'checkIn' | 'checkOut' | 'message'>;

export interface Review {
  _id: string;
  userName: string;
  userAvatar: string;
  date: string;
  review: string;
  rating: number;
  host: Host;
}
