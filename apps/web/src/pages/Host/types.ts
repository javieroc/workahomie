import { Host } from 'src/types';

export type UpdateHostDto = Partial<
  Pick<
    Host,
    'firstName' | 'lastName' | 'aboutMe' | 'occupation' | 'occupationDescription' | 'phone'
  >
> & {
  profile?: File;
};

export type UpdateHostPlaceFormValues = {
  placeDescription?: string;
  placeDetails?: string;
  facilities?: string[];
  // eslint-disable-next-line
  address?: any;
  pictures: {
    existing: { url: string }[];
    new: File[];
  };
};
