import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value, 10))
  offset: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value, 10))
  limit: number;
}
