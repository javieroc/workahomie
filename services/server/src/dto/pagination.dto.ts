import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
