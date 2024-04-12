export interface Place {
  _id: string;
  pictures: string[];
  description: string;
  details?: string;
  address: string;
  addressObj?: {
    label: string;
    lat: number;
    lng: number;
    // eslint-disable-next-line
    value: any;
  };
  facilities?: string[];
}
