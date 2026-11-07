import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { toOptionalNumber } from 'src/common/transforms';

const toLowerCaseList = ({ value }: { value: unknown }) => {
  if (!value) return value;
  const array = typeof value === 'string' ? value.split(',') : value;
  return Array.isArray(array)
    ? array.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
    : array;
};

export const DEFAULT_RADIUS_KM = 10;
export const MAX_RADIUS_KM = 200;

export class SearchParamsDto extends PaginationDto {
  /** Center latitude. */
  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  /** Center longitude. */
  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  /** Search radius around the center in km (default 10, capped at 200). */
  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(0)
  radius?: number;

  /** Bounding box (south-west / north-east corners). */
  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  swLat?: number;

  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  swLng?: number;

  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  neLat?: number;

  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  neLng?: number;

  @Transform(toLowerCaseList)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  occupations?: string[];

  @Transform(toLowerCaseList)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @Transform(toOptionalNumber)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rate?: number;
}
