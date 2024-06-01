// export interface FilterParams {
//   [key: string]: string | number;
// }

export interface FiltersParams {
  lat?: string;
  lng?: string;
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
