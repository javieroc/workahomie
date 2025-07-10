import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHostDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  occupation: string;

  @IsOptional()
  occupationDescription?: string;

  @IsOptional()
  aboutMe?: string;

  @IsNotEmpty()
  phone: string;
}
