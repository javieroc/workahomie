import { Facility } from 'src/constants/facilities';
import { Occupation } from 'src/constants/occupations';

export interface FiltersParams {
  lat?: number;
  lng?: number;
  occupations?: Occupation[];
  facilities?: Facility[];
  rate?: number;
}

export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationApiParams {
  limit?: number;
  offset?: number;
}

export interface ListResponse<Data> {
  data: Data[];
  total: number;
}
