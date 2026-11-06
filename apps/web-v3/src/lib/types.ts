export const FACILITIES = [
  'wifi',
  'coffee',
  'kitchen',
  'parking',
  'garden',
  'showers',
  'snacks',
] as const;
export type Facility = (typeof FACILITIES)[number];

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

/** GeoJSON point. Coordinates are [lng, lat] exactly as stored by the API. */
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Host {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  occupation: string;
  occupationDescription?: string;
  aboutMe?: string;
  phone?: string;
  profileImages: string[];
  placeDescription?: string;
  placeDetails?: string;
  /** JSON string produced by the geocoder (display_name, lat, lon, ...) or a plain string */
  address?: string;
  location?: GeoPoint;
  facilities?: string[];
  pictures: string[];
  rate: number;
  countReviews: number;
  /** meters, only present when searching around a center */
  distance?: number;
  isWishlisted?: boolean;
}

export interface HostPin {
  _id: string;
  location: GeoPoint;
  firstName: string;
  lastName: string;
  occupation: string;
  rate: number;
  countReviews: number;
  picture?: string;
}

export interface Message {
  _id?: string;
  requestId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  message: string;
  timeSent?: string;
}

export interface StayRequest {
  _id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  checkIn: string;
  checkOut: string;
  status: RequestStatus;
  host: Host;
  messages: Message[];
  createdAt?: string;
}

export interface Review {
  _id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  date: string;
  review: string;
  rating: number;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: 'own_place' | 'no_visit' | 'already_reviewed';
}

export interface Paginated<T> {
  data: T[];
  total: number;
}

export interface Stats {
  hosts: number;
  reviews: number;
  connections: number;
  cities: number;
}

export interface BBox {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}
