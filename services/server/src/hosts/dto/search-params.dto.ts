import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';

export class SearchParamsDto extends PaginationDto {
  @Transform(({ value }) => Number.parseFloat(value))
  @IsOptional()
  @IsNumber()
  lat?: number;

  @Transform(({ value }) => Number.parseFloat(value))
  @IsOptional()
  @IsNumber()
  lng?: number;

  @Transform(({ value }) => {
    if (!value) return value;
    const array = typeof value === 'string' ? value.split(',') : value;
    return array.map((item: string) => item.toLowerCase());
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  occupations?: string[];

  @Transform(({ value }) => {
    if (!value) return value;
    const array = typeof value === 'string' ? value.split(',') : value;
    return array.map((item: string) => item.toLowerCase());
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @Transform(({ value }) => Number.parseFloat(value))
  @IsOptional()
  @IsNumber()
  rate?: number;
}
