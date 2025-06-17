import { IsMongoId } from 'class-validator';

export class RemoveFromWishlistDto {
  @IsMongoId()
  hostId: string;
}
