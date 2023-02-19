import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHostPlaceDto {
  @IsNotEmpty()
  description: string;

  @IsOptional()
  details: string;

  @IsNotEmpty()
  address: string;

  @IsArray()
  @IsOptional()
  facilities: string[];
}
