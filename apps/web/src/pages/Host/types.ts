import { Host } from 'src/types';
import { CreateHostDto } from '../TryHosting/types';

export type UpdateHostDto = Partial<CreateHostDto>;

export type UpdateHostPlaceFormValues = Partial<
  Pick<Host, 'placeDescription' | 'placeDetails' | 'facilities'> & {
    pictures: File[];
    // eslint-disable-next-line
    address: any;
  }
>;
