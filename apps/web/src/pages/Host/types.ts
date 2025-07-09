import { Host } from 'src/types';

export type UpdateHostDto = Partial<
  Pick<Host, 'firstName' | 'lastName' | 'aboutMe' | 'occupation' | 'phone'>
> & {
  profile?: File;
};

export type UpdateHostPlaceFormValues = Partial<
  Pick<Host, 'placeDescription' | 'placeDetails' | 'facilities'> & {
    pictures: File[];
    // eslint-disable-next-line
    address: any;
  }
>;
