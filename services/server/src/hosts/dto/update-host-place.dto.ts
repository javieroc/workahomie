import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { toStringArray } from 'src/common/transforms';
import { CreateHostPlaceDto } from './create-host-place.dto';

export class UpdateHostPlaceDto extends PartialType(CreateHostPlaceDto) {
  @Transform(toStringArray)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  existingPictures?: string[];
}
