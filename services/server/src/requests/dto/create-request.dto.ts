import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsDateString()
  checkIn: string;

  @IsNotEmpty()
  @IsDateString()
  checkOut: string;

  @IsOptional()
  message?: string;
}
