import { IsInt, Max, Min } from 'class-validator';

export class DonateDto {
  /** Whole euros. */
  @IsInt()
  @Min(1)
  @Max(1000)
  amount: number;
}
