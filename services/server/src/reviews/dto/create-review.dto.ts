import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** `date`, `userId` and `host` are set server-side. */
export class CreateReviewDto {
  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  userAvatar: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  review: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
