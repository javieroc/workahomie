export interface Host {
  _id: string;
  profileImages: string[];
  rate: number;
  countReviews: number;
  firstName?: string;
  lastName?: string;
  aboutMe?: string;
  occupation?: string;
}
