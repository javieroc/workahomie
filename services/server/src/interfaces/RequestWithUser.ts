import { Request } from 'express';
import { Payload } from 'src/authz/types';

export interface RequestWithUser extends Request {
  user: Payload;
}
