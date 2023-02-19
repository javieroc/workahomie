import { PartialType } from '@nestjs/mapped-types';
import { CreateHostPlaceDto } from './create-host-place.dto';

export class UpdateHostPlaceDto extends PartialType(CreateHostPlaceDto) {}
