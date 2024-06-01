import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
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
}
