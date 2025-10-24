import { Facility } from 'src/constants/facilities';
import { Occupation } from 'src/constants/occupations';

export type Point = {
  type: string;
  coordinates: number[];
};

export interface Host {
  _id: string;
  profileImages: string[];
  rate: number;
  countReviews: number;
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  occupation?: Occupation;
  occupationDescription?: string;
  phone?: string;

  pictures: string[];
  placeDescription: string;
  placeDetails?: string;
  address: string;
  location: Point;
  // eslint-disable-next-line
  addressObj?: any;
  facilities?: Facility[];
}
