import { IsNotEmpty, IsNumber } from 'class-validator';

export class DonateDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
