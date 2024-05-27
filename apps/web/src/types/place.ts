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

export interface Place {
  _id: string;
  pictures: string[];
  description: string;
  details?: string;
  address: string;
  location: Point;
  addressObj?: {
    label: string;
    lat: number;
    lng: number;
    // eslint-disable-next-line
    value: any;
  };
  facilities?: Facilities[];
}
