import { Place } from 'src/types/place';
import { CreateHostDto } from '../TryHosting/types';

export type UpdateHostDto = Partial<CreateHostDto>;

export type UpdateHostPlaceFormValues = Partial<
  Omit<Place, '_id' | 'pictures' | 'address'> & {
    pictures: File[];
    address: {
      label: string;
      // eslint-disable-next-line
      value: any;
    };
  }
>;
