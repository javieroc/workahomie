import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { toStringArray } from 'src/common/transforms';

export class CreateHostPlaceDto {
  @IsNotEmpty()
  placeDescription: string;

  @IsOptional()
  placeDetails: string;

  /** JSON string: `{ "lat": number, "lon": number, ... }` */
  @IsNotEmpty()
  @IsString()
  address: string;

  @Transform(toStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities: string[];
}
