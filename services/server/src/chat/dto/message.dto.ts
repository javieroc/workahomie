import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsString()
  message: string;

  @IsString()
  timeSent: string;
}
