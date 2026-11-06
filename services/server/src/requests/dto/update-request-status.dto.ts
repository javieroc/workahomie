import { IsIn } from 'class-validator';
import { RequestStatus } from './create-request.dto';

export const UPDATABLE_STATUSES = [
  RequestStatus.ACCEPTED,
  RequestStatus.DECLINED,
  RequestStatus.CANCELLED,
] as const;

export type UpdatableStatus = (typeof UPDATABLE_STATUSES)[number];

export class UpdateRequestStatusDto {
  @IsIn(UPDATABLE_STATUSES)
  status: UpdatableStatus;
}
