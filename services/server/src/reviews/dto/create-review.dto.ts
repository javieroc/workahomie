import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  userAvatar: string;

  @IsString()
  review: string;

  @IsNotEmpty()
  @IsInt()
  rating: number;
}
