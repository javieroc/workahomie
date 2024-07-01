import { Host } from 'src/types';

export interface Request {
  _id: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  message: string;
  status: string;
  host: Host;
}

export type CreateRequestDto = Pick<Request, 'checkIn' | 'checkOut' | 'message'>;
