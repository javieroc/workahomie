import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsDateString()
  checkIn: Date;

  @IsNotEmpty()
  @IsDateString()
  checkOut: Date;

  @IsOptional()
  message?: string;
}
