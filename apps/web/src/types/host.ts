export type Facilities =
  | 'garden'
  | 'showers'
  | 'parking'
  | 'coffee'
  | 'kitchen'
  | 'wifi'
  | 'snacks';

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
  occupation?: string;
  occupationDescription?: string;
  phone?: string;

  pictures: string[];
  placeDescription: string;
  placeDetails?: string;
  address: string;
  location: Point;
  // eslint-disable-next-line
  addressObj?: any;
  facilities?: Facilities[];
}
