export interface Place {
  _id: string;
  pictures: string[];
  description: string;
  details?: string;
  address: string;
  addressLabel?: string;
  facilities?: string[];
}
