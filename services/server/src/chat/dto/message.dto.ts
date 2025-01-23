import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  message: string;

  @IsString()
  timeSent: string;
}
