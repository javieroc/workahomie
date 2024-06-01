import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHostPlaceDto {
  @IsNotEmpty()
  placeDescription: string;

  @IsOptional()
  placeDetails: string;

  @IsNotEmpty()
  address: string;

  @IsArray()
  @IsOptional()
  facilities: string[];
}
