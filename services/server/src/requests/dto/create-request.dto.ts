import { IsDateString, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export class CreateRequestDto {
  @IsNotEmpty()
  @IsDateString()
  checkIn: string;

  @IsNotEmpty()
  @IsDateString()
  checkOut: string;

  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  userAvatar?: string;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
