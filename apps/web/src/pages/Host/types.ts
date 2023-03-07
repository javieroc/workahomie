import { Place } from 'src/types/place';
import { CreateHostDto } from '../TryHosting/types';

export type UpdateHostDto = Partial<CreateHostDto>;

export type UpdateHostPlaceDto = Partial<
  Omit<Place, '_id' | 'pictures'> & {
    pictures: File[];
  }
>;
