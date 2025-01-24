import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  userAvatar?: string;

  @IsString()
  message: string;

  @IsString()
  timeSent: string;
}
