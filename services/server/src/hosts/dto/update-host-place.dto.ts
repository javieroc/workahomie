import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional } from 'class-validator';
import { CreateHostPlaceDto } from './create-host-place.dto';

export class UpdateHostPlaceDto extends PartialType(CreateHostPlaceDto) {
  @IsArray()
  @IsOptional()
  existingPictures?: string[];
}
